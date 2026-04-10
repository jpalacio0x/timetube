import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Player from '../components/Player';
import TimestampList from '../components/Timestamp';
import Bumpups from '../components/Bumpups';
import { useAuth } from '../hooks/useAuth';
import { useJob } from '../hooks/useJob';
import { toMarkdown } from '../utils/timestampParser';
import { JOB_STATUSES } from '../services/jobs';
import './VideoDetail.css';

export default function VideoDetail() {
  const { jobId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { job, loading, error } = useJob(user?.uid, jobId);
  const playerRef = useRef(null);
  const [activeSeconds, setActiveSeconds] = useState(null);

  const handleJump = (seconds) => {
    setActiveSeconds(seconds);
    playerRef.current?.seekTo(seconds);
  };

  const copyTimestamps = async () => {
    if (!job?.rows) return;
    try {
      await navigator.clipboard.writeText(toMarkdown(job.rows));
    } catch (_) {}
  };

  const downloadJson = () => {
    if (!job) return;
    const blob = new Blob([JSON.stringify(job.rows, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${job.videoId || 'timetube'}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (authLoading) return <AppShell><p>Loading…</p></AppShell>;
  if (!user) return <AppShell><p>Please <Link to="/login">sign in</Link>.</p></AppShell>;
  if (loading) return <AppShell><p>Loading job…</p></AppShell>;
  if (error) return <AppShell><p className="tt-err">Failed to load: {error.message}</p></AppShell>;
  if (!job) return <AppShell><p>Job not found.</p></AppShell>;

  const isReady = job.status === JOB_STATUSES.READY;

  return (
    <AppShell>
      <section className="page page--video">
        <Bumpups job={job} />

        {job.videoId && (
          <div className="tt-vd__player">
            <Player ref={playerRef} videoId={job.videoId} />
          </div>
        )}

        {isReady && job.rows && (
          <>
            <div className="tt-vd__actions">
              <button className="tt-btn tt-btn--ghost" onClick={copyTimestamps}>Copy</button>
              <button className="tt-btn tt-btn--ghost" onClick={downloadJson}>Download JSON</button>
            </div>
            <TimestampList
              rows={job.rows}
              onJump={handleJump}
              activeSeconds={activeSeconds}
            />
          </>
        )}
      </section>
    </AppShell>
  );
}
