import React from 'react';
import { useParams } from 'react-router-dom';

export default function VideoDetail() {
  const { jobId } = useParams();
  return (
    <main className="page page--video">
      <h1>Video Detail</h1>
      <p>Job: {jobId}</p>
    </main>
  );
}
