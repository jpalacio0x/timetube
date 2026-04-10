import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export async function summarizeChunk({ videoId, title, channel, transcriptChunk, isFinalPass = false }) {
  const fn = httpsCallable(functions, 'summarizeChunk');
  const res = await fn({ videoId, title, channel, transcriptChunk, isFinalPass });
  return res.data?.text || '';
}

export async function createSummaryJob({ videoUrl, forceRefresh = false }) {
  const fn = httpsCallable(functions, 'createSummaryJob');
  const res = await fn({ videoUrl, forceRefresh });
  return res.data;
}
