import React from 'react';
import './Bumpups.css';
import { JOB_STATUSES } from '../services/jobs';

const STATUS_COPY = {
  [JOB_STATUSES.QUEUED]: { label: 'Queued', hint: 'Your job is waiting for a worker.' },
  [JOB_STATUSES.TRANSCRIBING]: { label: 'Transcribing', hint: 'Pulling captions and text.' },
  [JOB_STATUSES.SUMMARIZING]: { label: 'Summarizing', hint: 'Model is drafting timestamps.' },
  [JOB_STATUSES.READY]: { label: 'Ready', hint: 'Timestamps below — click to jump.' },
  [JOB_STATUSES.FAILED]: { label: 'Failed', hint: 'See the error details and retry.' },
};

export default function Bumpups({ job }) {
  if (!job) return null;
  const copy = STATUS_COPY[job.status] || { label: job.status, hint: '' };

  return (
    <section className="tt-bump">
      <div className={`tt-bump__pill tt-bump__pill--${job.status}`}>{copy.label}</div>
      <div className="tt-bump__meta">
        <h2 className="tt-bump__title">{job.title || 'Untitled video'}</h2>
        {job.channel && <div className="tt-bump__channel">{job.channel}</div>}
        <p className="tt-bump__hint">{copy.hint}</p>
        {job.status === JOB_STATUSES.FAILED && job.error && (
          <pre className="tt-bump__err">{job.error}</pre>
        )}
      </div>
    </section>
  );
}
