import { describe, it, expect } from 'vitest';
import { formatKoreanDate } from '@shared/utils/date';

describe('formatKoreanDate', () => {
  it('formats an ISO date string to Korean format', () => {
    // Use noon UTC to avoid timezone-related date shifts
    expect(formatKoreanDate('2026-04-15T12:00:00.000Z')).toBe('2026년 4월 15일');
  });

  it('zero-pads single-digit days', () => {
    expect(formatKoreanDate('2026-04-05T12:00:00.000Z')).toBe('2026년 4월 05일');
  });
});
