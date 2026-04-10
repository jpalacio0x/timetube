# Timetube

Timetube is an AI assistant for long-form YouTube videos. Paste a link and the
app pulls the captions, summarizes the transcript with OpenAI, and returns a
clickable chapter list you can jump through on an embedded player.

## Why Timetube?

- **Skip the fluff** — concise chapter-style timestamps for any video.
- **Own your history** — Firebase stores every run so you can revisit them.
- **Stay in flow** — Firestore snapshots drive live status updates while the
  job runs in the background.

## Core Features

1. **YouTube ingestion** — captions-first via `youtube-captions-scraper`,
   metadata via the YouTube Data API.
2. **AI timestamp generation** — a strict prompt contract produces
   `[HH:MM:SS] Title – note` lines, validated on the client.
3. **Insight cards** — the `Bumpups` status pill surfaces
   queued/transcribing/summarizing/ready/failed states in real time.
4. **Workspace sync** — every job lives in `users/{uid}/jobs/{jobId}`;
   identical URLs reuse a shared `videos/{videoId}` cache.
5. **Export & share** — copy timestamps as markdown or download as JSON.

## Tech Stack

| Layer        | Tools                                                        |
|--------------|--------------------------------------------------------------|
| Frontend     | React 19, React Router 6, React Query 5                      |
| State & Data | Firebase Auth + Firestore + Storage                          |
| AI           | OpenAI `gpt-4o-mini` via a Firebase callable function        |
| Video Input  | YouTube Data API, youtube-captions-scraper                   |
| Tooling      | Create React App, cross-env, Node 20 (functions runtime)     |

## Getting Started

```bash
# 1. Web app
npm install
cp .env.example .env                    # fill in Firebase + YouTube keys
npm start

# 2. Cloud Functions
cd functions
npm install
firebase functions:secrets:set OPENAI_API_KEY
firebase deploy --only functions,firestore:rules,storage
```

## Scripts

- `npm start` — CRA dev server.
- `npm test` — Jest + React Testing Library.
- `npm run build` — production bundle (served by Firebase Hosting).

## Project Layout

```
src/
├── components/    # AppShell, Navbar, Player, TimestampList, Bumpups, Footer
├── hooks/         # useAuth, useJob, useUserJobs, useSummarize, useVideoMetadata
├── pages/         # LandingPage, Dashboard, VideoDetail, Library, Login
├── services/      # openai (callable wrapper), youtube, jobs (firestore)
└── utils/         # youtube id parser, time fns, timestampParser, chunker, prompt

functions/
├── index.js       # summarizeChunk + createSummaryJob callables
└── lib/           # captions, chunker, prompt, parser (server copies)
```

## Workflow Highlights

- **Captions first** — `fetchCaptions` walks through `en`, `en-US`, `en-GB`
  before giving up. Whisper audio fallback is on the roadmap.
- **Chunk + summarize** — long transcripts are split with a character-based
  chunker (12k chars, 400 char overlap). Each chunk is summarized, then a
  final merge pass deduplicates across chunks.
- **Realtime progress** — Firestore snapshot listeners (`useJob`) drive the
  `Bumpups` status pill so users see `queued → transcribing → summarizing →
  ready` without polling.
- **Caching** — identical YouTube IDs reuse the latest successful run unless
  the client passes `forceRefresh: true`.

## Roadmap

- Whisper audio fallback when captions are absent.
- Multi-language output.
- Chrome extension to trigger Timetube from a YouTube tab.
- Collaborative playlists + Notion/Obsidian export.

## Contributing

Issues and PRs welcome. For major feature proposals, open a discussion first
so we can align on data costs and UX.

---

Timetube turns hours of video into actionable minutes.
