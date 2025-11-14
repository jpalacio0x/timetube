# Timetube

Timetube is an AI assistant for long-form YouTube videos. Paste a link and the app streams the audio through the OpenAI API, summarizes the content, and produces shareable timestamp outlines so you can jump directly to the moments that matter.

## Why Timetube?

- **Skip the fluff** – get concise chapter-style timestamps for any video.  
- **Save progress** – Firebase stores your history and personalized prompts.  
- **Stay in flow** – React keeps everything fast with optimistic UI updates while the AI processes the video in the background.

## Core Features

1. **YouTube ingestion** – fetches metadata, captions, or transcribed audio for private/public links.  
2. **AI timestamp generation** – OpenAI responses are constrained to a timestamp-aware schema.  
3. **Insight cards** – surface key clips, action items, and quotable moments.  
4. **Workspace sync** – user playlists, custom prompts, and past summaries live in Firestore.  
5. **Export & share** – copy timestamps, download JSON, or drop them straight into your notes.

## Tech Stack

| Layer        | Tools                                                        |
|--------------|--------------------------------------------------------------|
| Frontend     | React 19, React Router, Tailwind (optional)                  |
| State & Data | Firebase Auth + Firestore, React Query                       |
| AI           | OpenAI Responses API (batch + streaming)                     |
| Video Input  | YouTube Data API / captions / fallback audio transcription   |
| Tooling      | Create React App, cross-env, Node 25                         |

## Getting Started

```bash
git clone https://github.com/your-user/timetube.git
cd timetube
npm install

# copy env template and add keys
cp .env.example .env.local

# start the dev server
npm start
```

### Required environment variables

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_OPENAI_API_KEY=
REACT_APP_YOUTUBE_API_KEY=
```

> Keep secret keys in `.env.local` (ignored by git). For CI/CD, configure them as build-time variables.

## Scripts

- `npm start` – CRA dev server with hot reload.  
- `npm test` – Jest + React Testing Library suites.  
- `npm run build` – optimized production bundle.  
- `npm run eject` – (optional) expose CRA configs.

## Project Layout

```
src/
├── components/       # UI primitives, timeline cards, loaders
├── hooks/            # firebase auth, youtube metadata, openai streaming
├── pages/            # Dashboard, VideoDetail, Library
├── services/         # openai client, youtube fetchers, timestamp parser
└── utils/            # formatting, prompt templates, error helpers
```

## Workflow Highlights

- **Captions first** – prefer official captions; fall back to audio transcription stored in Firebase Storage.  
- **Chunk + summarize** – long videos are chunked, summarized, then merged with GPT instructions to guarantee strictly formatted timestamps (`[HH:MM:SS] Title – note`).  
- **Realtime progress** – Firestore document tracks job status so users see “Queued → Transcribing → Summarizing → Ready”.  
- **Caching** – identical video requests reuse the latest successful run unless a user forces refresh.

## Roadmap Ideas

- Multi-language timestamp output.  
- Chrome extension to run Timetube on YouTube directly.  
- Collaborative playlists with shared annotations.  
- Auto-sync to Notion/Obsidian via webhooks.

## Contributing

Issues and PRs are welcome! Please include reproduction steps, screenshots, or test updates where applicable. For major feature proposals, open a discussion first so we can align on data costs and UX.

---

Timetube turns hours of video into actionable minutes. Enjoy faster learning ✨
