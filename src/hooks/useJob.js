import { useEffect, useState } from 'react';
import { subscribeJob, subscribeUserJobs } from '../services/jobs';

export function useJob(uid, jobId) {
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid || !jobId) return undefined;
    setError(null);
    return subscribeJob(uid, jobId, setJob, setError);
  }, [uid, jobId]);

  return { job, error, loading: !job && !error };
}

export function useUserJobs(uid, max = 50) {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return undefined;
    setLoading(true);
    return subscribeUserJobs(
      uid,
      (list) => {
        setJobs(list);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
      max
    );
  }, [uid, max]);

  return { jobs, error, loading };
}
