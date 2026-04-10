import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthed, loginWithGoogle, logout } = useAuth();

  return (
    <header className="tt-nav">
      <Link to="/" className="tt-nav__brand">
        <span className="tt-nav__logo">⏱</span>
        <span>Timetube</span>
      </Link>

      <nav className="tt-nav__links">
        <NavLink to="/app" end>Dashboard</NavLink>
        <NavLink to="/app/library">Library</NavLink>
      </nav>

      <div className="tt-nav__actions">
        {isAuthed ? (
          <>
            <span className="tt-nav__user">{user.displayName || user.email}</span>
            <button className="tt-btn tt-btn--ghost" onClick={logout}>Sign out</button>
          </>
        ) : (
          <button className="tt-btn" onClick={loginWithGoogle}>Sign in</button>
        )}
      </div>
    </header>
  );
}
