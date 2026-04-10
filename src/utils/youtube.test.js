import { extractVideoId, toEmbedUrl, toWatchUrl } from './youtube';

describe('extractVideoId', () => {
  test.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/live/dQw4w9WgXcQ?si=abc', 'dQw4w9WgXcQ'],
    ['dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ])('parses %s', (input, expected) => {
    expect(extractVideoId(input)).toBe(expected);
  });

  test('returns null for garbage', () => {
    expect(extractVideoId('https://example.com')).toBeNull();
    expect(extractVideoId('')).toBeNull();
    expect(extractVideoId(null)).toBeNull();
  });
});

test('toEmbedUrl includes start seconds', () => {
  expect(toEmbedUrl('dQw4w9WgXcQ', 65)).toBe(
    'https://www.youtube.com/embed/dQw4w9WgXcQ?start=65&rel=0'
  );
});

test('toWatchUrl normalizes negative start', () => {
  expect(toWatchUrl('dQw4w9WgXcQ', -10)).toBe(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=0s'
  );
});
