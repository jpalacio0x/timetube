import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <main className="lp__main">
        <h1 className="lp__title">Turn long videos into clickable chapters.</h1>
        <p className="lp__sub">
          Timetube fetches captions from any YouTube video and returns a
          summary you can jump through — no scrubbing, no filler.
        </p>
        <div className="lp__cta">
          <Link to="/app" className="lp__btn lp__btn--primary">Try it now</Link>
          <a
            href="https://github.com/jpalacio0x/timetube"
            target="_blank"
            rel="noreferrer"
            className="lp__btn"
          >
            GitHub
          </a>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
