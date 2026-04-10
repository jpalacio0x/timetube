import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  limit,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

export const JOB_STATUSES = Object.freeze({
  QUEUED: 'queued',
  TRANSCRIBING: 'transcribing',
  SUMMARIZING: 'summarizing',
  READY: 'ready',
  FAILED: 'failed',
});

export function subscribeJob(uid, jobId, onChange, onError) {
  if (!uid || !jobId) return () => {};
  const ref = doc(db, 'users', uid, 'jobs', jobId);
  return onSnapshot(
    ref,
    (snap) => onChange(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    onError
  );
}

export function subscribeUserJobs(uid, onChange, onError, max = 50) {
  if (!uid) return () => {};
  const col = collection(db, 'users', uid, 'jobs');
  const q = query(col, orderBy('createdAt', 'desc'), limit(max));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function subscribeJobsByVideo(uid, videoId, onChange) {
  if (!uid || !videoId) return () => {};
  const col = collection(db, 'users', uid, 'jobs');
  const q = query(col, where('videoId', '==', videoId), orderBy('createdAt', 'desc'), limit(5));
  return onSnapshot(q, (snap) =>
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
