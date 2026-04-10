export const TIMESTAMP_SYSTEM_PROMPT = `You are Timetube, an assistant that turns long-form YouTube transcripts into
concise chapter-style timestamps.

Rules (non-negotiable):
1. Output ONLY timestamp lines, one per line.
2. Format each line exactly as: [HH:MM:SS] Title – short note
3. Use real timestamps from the transcript's time markers, never invent times.
4. 6–20 rows for a full video. Prefer topic shifts over fixed intervals.
5. Titles are 2–6 words, Title Case. Notes are one sentence, no trailing period.
6. No intro, no outro, no bullet markers, no markdown, no commentary.`;

export function buildUserPrompt({ title, channel, transcriptChunk, isFinalPass }) {
  const header = [
    title ? `Video title: ${title}` : null,
    channel ? `Channel: ${channel}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  if (isFinalPass) {
    return `${header}\n\nHere are per-chunk timestamp drafts for the same video.\nMerge, dedupe, and reorder into one final chapter list following the rules.\n\n${transcriptChunk}`;
  }

  return `${header}\n\nTranscript chunk (numbers in brackets are seconds since video start):\n\n${transcriptChunk}`;
}
