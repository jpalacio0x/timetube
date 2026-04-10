const DEFAULT_CHARS_PER_CHUNK = 12_000;
const DEFAULT_OVERLAP = 400;

export function chunkTranscript(
  segments,
  { maxChars = DEFAULT_CHARS_PER_CHUNK, overlap = DEFAULT_OVERLAP } = {}
) {
  if (!Array.isArray(segments) || segments.length === 0) return [];

  const chunks = [];
  let current = { start: segments[0].start, end: segments[0].end, text: '' };

  for (const seg of segments) {
    const line = `[${Math.floor(seg.start)}] ${seg.text}\n`;
    if (current.text.length + line.length > maxChars && current.text.length > 0) {
      chunks.push({ ...current });
      const tailChar = Math.max(0, current.text.length - overlap);
      current = {
        start: seg.start,
        end: seg.end,
        text: current.text.slice(tailChar),
      };
    }
    current.end = seg.end;
    current.text += line;
  }
  if (current.text.trim()) chunks.push(current);
  return chunks;
}

export function chunkPlainText(text, maxChars = DEFAULT_CHARS_PER_CHUNK) {
  if (!text) return [];
  const out = [];
  for (let i = 0; i < text.length; i += maxChars) {
    out.push(text.slice(i, i + maxChars));
  }
  return out;
}
