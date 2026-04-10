import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

export default function Login() {
  const { isAuthed, loading, loginWithGoogle, error } = useAuth();
  const location = useLocation();
  const next = location.state?.from || '/app';

  if (loading) return <AppShell><p>Loading…</p></AppShell>;
  if (isAuthed) return <Navigate to={next} replace />;

  return (
    <AppShell>
      <section className="page page--login tt-login">
        <h1>Sign in to Timetube</h1>
        <p>One-click Google sign-in. We only store your display name, email, and the jobs you create.</p>
        <button className="tt-btn tt-login__btn" onClick={loginWithGoogle}>
          Continue with Google
        </button>
        {error && <div className="tt-login__err">{error.message}</div>}
      </section>
    </AppShell>
  );
}
