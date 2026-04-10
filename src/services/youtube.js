import { extractVideoId } from '../utils/youtube';

const API_BASE = 'https://www.googleapis.com/youtube/v3';

export async function fetchVideoMetadata(urlOrId) {
  const videoId = extractVideoId(urlOrId);
  if (!videoId) throw new Error('Not a valid YouTube URL or video ID.');
  const key = process.env.REACT_APP_YOUTUBE_API_KEY;
  if (!key) throw new Error('Missing REACT_APP_YOUTUBE_API_KEY.');

  const url = `${API_BASE}/videos?part=snippet,contentDetails&id=${videoId}&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API error ${res.status}`);
  const data = await res.json();
  const item = data.items && data.items[0];
  if (!item) throw new Error('Video not found or unavailable.');

  return {
    videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.maxres?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.default?.url,
    durationIso: item.contentDetails.duration,
  };
}

export function isoDurationToSeconds(iso) {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const [, h, min, s] = m;
  return (parseInt(h || 0, 10) * 3600) + (parseInt(min || 0, 10) * 60) + parseInt(s || 0, 10);
}
