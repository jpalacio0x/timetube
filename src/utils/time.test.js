import { secondsToTimestamp, timestampToSeconds, formatDuration } from './time';

test('secondsToTimestamp pads zeros', () => {
  expect(secondsToTimestamp(0)).toBe('00:00:00');
  expect(secondsToTimestamp(65)).toBe('00:01:05');
  expect(secondsToTimestamp(3725)).toBe('01:02:05');
});

test('timestampToSeconds handles HH:MM:SS and MM:SS', () => {
  expect(timestampToSeconds('01:02:05')).toBe(3725);
  expect(timestampToSeconds('02:05')).toBe(125);
  expect(timestampToSeconds(null)).toBe(0);
});

test('formatDuration switches unit bands', () => {
  expect(formatDuration(45)).toBe('45s');
  expect(formatDuration(90)).toBe('1m 30s');
  expect(formatDuration(3600)).toBe('1h 0m');
});
