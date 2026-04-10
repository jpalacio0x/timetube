import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import './Player.css';

// Minimal wrapper around the YouTube IFrame Player API so parents can
// imperatively seek when a timestamp row is clicked.
const Player = forwardRef(function Player({ videoId }, ref) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoId) return undefined;

    let cancelled = false;
    const ensureApi = () =>
      new Promise((resolve) => {
        if (window.YT && window.YT.Player) return resolve(window.YT);
        const existing = document.getElementById('yt-iframe-api');
        if (!existing) {
          const tag = document.createElement('script');
          tag.id = 'yt-iframe-api';
          tag.src = 'https://www.youtube.com/iframe_api';
          document.body.appendChild(tag);
        }
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (prev) prev();
          resolve(window.YT);
        };
      });

    ensureApi().then((YT) => {
      if (cancelled || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
      });
    });

    return () => {
      cancelled = true;
      if (playerRef.current && playerRef.current.destroy) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
    };
  }, [videoId]);

  useImperativeHandle(ref, () => ({
    seekTo(seconds) {
      const p = playerRef.current;
      if (p && p.seekTo) {
        p.seekTo(seconds, true);
        if (p.playVideo) p.playVideo();
      }
    },
  }));

  return (
    <div className="tt-player">
      <div ref={containerRef} className="tt-player__frame" />
    </div>
  );
});

export default Player;
