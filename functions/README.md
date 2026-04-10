# Timetube — Cloud Functions

Server-side workers that keep the OpenAI API key off the client and own the
end-to-end job lifecycle.

## Functions

- `summarizeChunk` — callable. Low-level proxy for ad-hoc re-summaries. Takes a
  transcript chunk and returns timestamp lines.
- `createSummaryJob` — callable. Orchestrates the full pipeline: captions →
  chunk → per-chunk summary → final merge → Firestore write + video cache.

## Setup

```bash
cd functions
npm install
firebase functions:secrets:set OPENAI_API_KEY
firebase deploy --only functions
```

The `OPENAI_API_KEY` secret is mounted into both callables via
`defineSecret(...)`; it is never exposed to clients.

## Data model

- `users/{uid}/jobs/{jobId}` — per-user job state. Statuses: `queued`,
  `transcribing`, `summarizing`, `ready`, `failed`.
- `videos/{videoId}` — shared cache. Identical URLs reuse the latest successful
  run unless the caller passes `forceRefresh: true`.

## Gotchas

- `ytdl-core` and `youtube-captions-scraper` break when YouTube changes its
  player internals. Pin versions and watch for 403/parse errors in logs.
- Videos without captions currently fail with `failed-precondition`. Audio
  transcription fallback (Whisper) is a follow-up.
