import React from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useUserJobs } from '../hooks/useJob';
import './Library.css';

export default function Library() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const { jobs, loading, error } = useUserJobs(user?.uid);

  if (authLoading) return <AppShell><p>Loading…</p></AppShell>;
  if (!user) {
    return (
      <AppShell>
        <section className="page page--library">
          <h1>Library</h1>
          <p>Sign in to see your saved runs.</p>
          <button className="tt-btn" onClick={loginWithGoogle}>Sign in with Google</button>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="page page--library">
        <h1>Library</h1>
        {loading && <p>Loading your runs…</p>}
        {error && <p className="tt-err">{error.message}</p>}
        {!loading && !jobs.length && (
          <p>No runs yet. Head to the <Link to="/app">Dashboard</Link> to make one.</p>
        )}
        <ul className="tt-lib">
          {jobs.map((job) => (
            <li key={job.id} className="tt-lib__row">
              <Link to={`/app/video/${job.id}`} className="tt-lib__link">
                <div className="tt-lib__title">{job.title || job.videoUrl}</div>
                <div className="tt-lib__meta">
                  <span className={`tt-lib__status tt-lib__status--${job.status}`}>
                    {job.status}
                  </span>
                  {job.channel && <span>{job.channel}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
