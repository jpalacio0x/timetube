const YOUTUBE_ID_RE =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;

export function extractVideoId(url) {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(YOUTUBE_ID_RE);
  return match ? match[1] : null;
}

export function toEmbedUrl(videoId, startSeconds = 0) {
  if (!videoId) return '';
  const start = Math.max(0, Math.floor(Number(startSeconds) || 0));
  return `https://www.youtube.com/embed/${videoId}?start=${start}&rel=0`;
}

export function toWatchUrl(videoId, startSeconds = 0) {
  if (!videoId) return '';
  const start = Math.max(0, Math.floor(Number(startSeconds) || 0));
  return `https://www.youtube.com/watch?v=${videoId}&t=${start}s`;
}
