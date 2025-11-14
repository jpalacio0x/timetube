import React from 'react';
import './LandingPage.css';
import Navbar from './components/navbar';
import Bumpups from './components/Bumpups';
import Timestamp from './components/Timestamp';
import Footer from './components/Footer';

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <h1 className="landing-title">Hello Landing Page</h1>
      <Bumpups />
      <Timestamp />
      <Footer />
    </div>
  );
}

export default LandingPage;

