import { parseTimestampBlock, toMarkdown } from './timestampParser';

const SAMPLE = `
[00:00:00] Cold Open – Intro and context
[00:01:15] What Is Timetube – The pitch in one minute
[00:01:15] What Is Timetube – duplicate should drop
[00:05:42] Under The Hood – How chunking works
[99:99] garbage line should be ignored
[01:12:30] Wrap Up – Final thoughts
`;

test('parses valid lines and drops duplicates', () => {
  const rows = parseTimestampBlock(SAMPLE);
  expect(rows).toHaveLength(4);
  expect(rows[0]).toEqual({
    stamp: '00:00:00',
    seconds: 0,
    title: 'Cold Open',
    note: 'Intro and context',
  });
  expect(rows[3].seconds).toBe(4350); // 1h12m30s
});

test('sorts rows ascending by seconds', () => {
  const rows = parseTimestampBlock(`
[00:05:00] Later Topic – comes second
[00:01:00] Earlier Topic – comes first
`);
  expect(rows.map((r) => r.seconds)).toEqual([60, 300]);
});

test('toMarkdown renders one bullet per row', () => {
  const rows = parseTimestampBlock(SAMPLE);
  const md = toMarkdown(rows);
  expect(md.split('\n')).toHaveLength(rows.length);
  expect(md).toMatch(/- \[00:00:00\] Cold Open — Intro and context/);
});
