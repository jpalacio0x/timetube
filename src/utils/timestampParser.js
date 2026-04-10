import { timestampToSeconds } from './time';

const LINE_RE = /^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^–\-|]+)(?:[–\-|]\s*(.+))?$/;

export function parseTimestampBlock(raw) {
  if (!raw) return [];
  const lines = String(raw)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows = [];
  for (const line of lines) {
    const match = line.match(LINE_RE);
    if (!match) continue;
    const [, stamp, title, note] = match;
    rows.push({
      stamp,
      seconds: timestampToSeconds(stamp),
      title: title.trim(),
      note: note ? note.trim() : '',
    });
  }
  return dedupeAndSort(rows);
}

function dedupeAndSort(rows) {
  const seen = new Set();
  const unique = [];
  for (const row of rows) {
    const key = `${row.seconds}|${row.title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
  }
  unique.sort((a, b) => a.seconds - b.seconds);
  return unique;
}

export function toMarkdown(rows) {
  return rows
    .map((r) => `- [${r.stamp}] ${r.title}${r.note ? ` — ${r.note}` : ''}`)
    .join('\n');
}
