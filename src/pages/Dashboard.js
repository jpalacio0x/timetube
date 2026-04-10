import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useSummarize } from '../hooks/useSummarize';
import { extractVideoId } from '../utils/youtube';
import './Dashboard.css';

export default function Dashboard() {
  const { isAuthed, loading, loginWithGoogle } = useAuth();
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState(null);
  const summarize = useSummarize();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!extractVideoId(url)) {
      setLocalError('Please paste a valid YouTube URL.');
      return;
    }
    if (!isAuthed) {
      try { await loginWithGoogle(); } catch (_) { return; }
    }
    try {
      const res = await summarize.mutateAsync({ videoUrl: url });
      if (res?.jobId) navigate(`/app/video/${res.jobId}`);
    } catch (err) {
      setLocalError(err.message || 'Something went wrong.');
    }
  };

  return (
    <AppShell>
      <section className="page page--dashboard">
        <h1>Generate timestamps for any YouTube video</h1>
        <p className="tt-dash__sub">
          Paste a link. We fetch the captions, summarize them, and hand you a
          clickable chapter list.
        </p>

        <form className="tt-dash__form" onSubmit={onSubmit}>
          <input
            type="url"
            inputMode="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="tt-dash__input"
            required
          />
          <button
            type="submit"
            className="tt-btn tt-dash__submit"
            disabled={summarize.isPending || loading}
          >
            {summarize.isPending ? 'Working…' : 'Generate'}
          </button>
        </form>

        {(localError || summarize.error) && (
          <div className="tt-dash__error">
            {localError || summarize.error.message}
          </div>
        )}

        {!isAuthed && !loading && (
          <p className="tt-dash__hint">
            Sign-in required — a Google popup opens the first time you submit.
          </p>
        )}
      </section>
    </AppShell>
  );
}
