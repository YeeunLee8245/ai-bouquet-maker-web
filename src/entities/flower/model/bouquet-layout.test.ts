import { describe, it, expect } from 'vitest';
import { computePositions, CENTER, CANVAS } from './bouquet-layout';

describe('computePositions', () => {
  // ── Happy Path ──

  it('꽃이 없으면 빈 배열을 반환한다', () => {
    expect(computePositions(0, [])).toEqual([]);
  });

  it('꽃이 1개면 캔버스 중앙 위치를 반환한다', () => {
    const result = computePositions(1, [60]);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ x: CENTER, y: CENTER });
  });

  it('꽃이 2개면 첫 번째는 중앙, 두 번째는 주변에 배치된다', () => {
    const result = computePositions(2, [60, 60]);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ x: CENTER, y: CENTER });
    // 두 번째 꽃은 중앙과 다른 위치
    expect(result[1]).not.toEqual({ x: CENTER, y: CENTER });
  });

  it('꽃이 5개면 정확히 5개의 위치를 반환한다', () => {
    const sizes = Array(5).fill(60);
    const result = computePositions(5, sizes);
    expect(result).toHaveLength(5);
  });

  // ── Edge Case ──

  it('모든 꽃 위치는 캔버스 경계 안에 있다', () => {
    const count = 10;
    const sizes = Array(count).fill(60);
    const result = computePositions(count, sizes);

    result.forEach(({ x, y }, i) => {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(CANVAS);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(CANVAS);
    });
  });

  it('꽃 수와 동일한 개수의 위치를 반환한다', () => {
    [1, 3, 7, 15].forEach((count) => {
      const sizes = Array(count).fill(60);
      expect(computePositions(count, sizes)).toHaveLength(count);
    });
  });
});
