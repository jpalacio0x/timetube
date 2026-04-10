const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

const { extractVideoId } = require('./lib/videoId');
const { fetchCaptions } = require('./lib/captions');
const { buildUserPrompt, TIMESTAMP_SYSTEM_PROMPT } = require('./lib/prompt');
const { chunkTranscript } = require('./lib/chunker');
const { parseTimestampBlock } = require('./lib/timestampParser');

admin.initializeApp();
const db = admin.firestore();

const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');
const MODEL = 'gpt-4o-mini';

function requireAuth(request) {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in required.');
  }
  return request.auth.uid;
}

async function callOpenAI(apiKey, { system, user }) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new HttpsError('internal', `OpenAI ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

exports.summarizeChunk = onCall(
  { secrets: [OPENAI_API_KEY], timeoutSeconds: 120, memory: '512MiB' },
  async (request) => {
    requireAuth(request);
    const { title, channel, transcriptChunk, isFinalPass } = request.data || {};
    if (!transcriptChunk) {
      throw new HttpsError('invalid-argument', 'transcriptChunk is required.');
    }
    const user = buildUserPrompt({ title, channel, transcriptChunk, isFinalPass });
    const text = await callOpenAI(OPENAI_API_KEY.value(), {
      system: TIMESTAMP_SYSTEM_PROMPT,
      user,
    });
    return { text };
  }
);

exports.createSummaryJob = onCall(
  { secrets: [OPENAI_API_KEY], timeoutSeconds: 540, memory: '1GiB' },
  async (request) => {
    const uid = requireAuth(request);
    const { videoUrl, forceRefresh = false } = request.data || {};
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new HttpsError('invalid-argument', 'Invalid YouTube URL.');
    }

    const cacheRef = db.collection('videos').doc(videoId);
    if (!forceRefresh) {
      const cached = await cacheRef.get();
      if (cached.exists && cached.data().status === 'ready') {
        const jobRef = await writeJob(uid, videoId, cached.data(), 'cache');
        return { jobId: jobRef.id, cached: true };
      }
    }

    const jobRef = db.collection('users').doc(uid).collection('jobs').doc();
    await jobRef.set({
      videoId,
      videoUrl,
      status: 'queued',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    try {
      await jobRef.update({ status: 'transcribing' });
      const { segments, title, channel } = await fetchCaptions(videoId);
      if (!segments.length) {
        throw new HttpsError('failed-precondition', 'No captions available for this video.');
      }

      await jobRef.update({ status: 'summarizing', title, channel });
      const chunks = chunkTranscript(segments);
      const drafts = [];
      for (const chunk of chunks) {
        const text = await callOpenAI(OPENAI_API_KEY.value(), {
          system: TIMESTAMP_SYSTEM_PROMPT,
          user: buildUserPrompt({ title, channel, transcriptChunk: chunk.text, isFinalPass: false }),
        });
        drafts.push(text);
      }

      const merged = chunks.length > 1
        ? await callOpenAI(OPENAI_API_KEY.value(), {
            system: TIMESTAMP_SYSTEM_PROMPT,
            user: buildUserPrompt({
              title,
              channel,
              transcriptChunk: drafts.join('\n\n'),
              isFinalPass: true,
            }),
          })
        : drafts[0];

      const rows = parseTimestampBlock(merged);
      const payload = {
        status: 'ready',
        title,
        channel,
        rows,
        rawMarkdown: merged,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await jobRef.update(payload);
      await cacheRef.set(
        { ...payload, videoId, cachedAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );

      return { jobId: jobRef.id, cached: false };
    } catch (err) {
      logger.error('createSummaryJob failed', err);
      await jobRef.update({
        status: 'failed',
        error: err.message || String(err),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      if (err instanceof HttpsError) throw err;
      throw new HttpsError('internal', err.message || 'Job failed');
    }
  }
);

async function writeJob(uid, videoId, cached, source) {
  const ref = db.collection('users').doc(uid).collection('jobs').doc();
  await ref.set({
    videoId,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    status: 'ready',
    title: cached.title,
    channel: cached.channel,
    rows: cached.rows || [],
    rawMarkdown: cached.rawMarkdown || '',
    source,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return ref;
}
