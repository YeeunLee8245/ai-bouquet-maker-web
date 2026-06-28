type THsl = { h: number; s: number; l: number };

/**
 * hex 문자열을 HSL로 변환한다.
 * @example hexToHsl('#ed708d') // { h: 347, s: 77, l: 68 }
 */
function hexToHsl(hex: string): THsl {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = d / (1 - Math.abs(2 * l - 1));

  let h = 0;
  if (max === r) {
    h = ((g - b) / d + 6) % 6 * 60;
  } else if (max === g) {
    h = ((b - r) / d + 2) * 60;
  } else {
    h = ((r - g) / d + 4) * 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * hsl(H, S%, L%) 문자열을 파싱한다.
 */
function parseHslString(hslStr: string): THsl {
  const match = hslStr.match(/hsl\(\s*(\d+),\s*(\d+)%?,\s*(\d+)%?\s*\)/);
  if (!match) { return { h: 0, s: 0, l: 50 }; }
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) };
}

/**
 * 색상 문자열(hex 또는 hsl)을 HSL로 변환한다.
 */
function parseColor(color: string): THsl {
  if (color.startsWith('#')) { return hexToHsl(color); }
  if (color.startsWith('hsl')) { return parseHslString(color); }
  return { h: 0, s: 0, l: 50 };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hslToCss(h: number, s: number, l: number): string {
  return `hsl(${h}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%)`;
}

/**
 * 포장지 뒷면 SVG용 색상 2개를 파생한다.
 * cls-1: 살짝 밝은 면 (접힘 하이라이트)
 * cls-2: 기본 면 (본체)
 */
export function deriveWrapBackShades(color: string): [string, string] {
  const { h, s, l } = parseColor(color);
  return [
    hslToCss(h, s, clamp(l + 3, 0, 100)),
    hslToCss(h, s, l),
  ];
}

/**
 * 포장지 앞면 SVG용 색상 2개를 파생한다.
 * cls-1: 기본 면 (접힘)
 * cls-2: 밝은 면 (하이라이트)
 */
export function deriveWrapFrontShades(color: string): [string, string] {
  const { h, s, l } = parseColor(color);
  return [
    hslToCss(h, s, clamp(l + 3, 0, 100)),
    hslToCss(h, s, clamp(l + 7, 0, 100)),
  ];
}

/**
 * 리본 SVG용 색상 3개를 파생한다.
 * cls-1: 어두운 면 (그림자)
 * cls-2: 밝은 면 (하이라이트)
 * cls-3: 중간 면 (본체)
 */
export function deriveRibbonShades(color: string): [string, string, string] {
  const { h, s, l } = parseColor(color);
  return [
    hslToCss(h, s, clamp(l - 4, 0, 100)),
    hslToCss(h, s, clamp(l + 4, 0, 100)),
    hslToCss(h, s, l),
  ];
}
