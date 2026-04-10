import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './AppShell.css';

export default function AppShell({ children }) {
  return (
    <div className="tt-shell">
      <Navbar />
      <div className="tt-shell__body">{children}</div>
      <Footer />
    </div>
  );
}
