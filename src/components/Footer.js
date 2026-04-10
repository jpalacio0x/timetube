import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="tt-footer">
      <div>© {new Date().getFullYear()} Timetube</div>
      <div className="tt-footer__links">
        <a href="https://github.com/jpalacio0x/timetube" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}
