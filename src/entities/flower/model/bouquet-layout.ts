export type TPreviewFlower = {
  id: string;
  svgUrl: string;
  size: number;
  x: number;
  y: number;
  name: string;
  flowerId: string;
  meaningId: string;
  color: string;
};

export const FLOWER_SIZE = 60;
export const CANVAS = 330;
export const CENTER = CANVAS / 2;

/** 캔버스 레이어 z-index */
export const Z_WRAP_BACK = 0;
export const Z_FLOWER_MAX = CANVAS + 1; // 드래그 중 꽃 최대값
export const Z_WRAP_FRONT = CANVAS + 2;
export const Z_RIBBON = CANVAS + 3;

/** y 위치 기반 꽃 z-index (아래 = 앞) */
export function flowerZIndex(y: number): number {
  return Math.round(y) + 1;
}

/** 꽃 수에 반비례하는 크기 계산 */
export function computeFlowerSize(count: number): number {
  if (count <= 2) { return 100; }
  if (count <= 5) { return 80; }
  if (count <= 10) { return 65; }
  return FLOWER_SIZE;
}

type FlowerColor = 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'white' | 'yellow';

export const FLOWER_CATEGORY_MAP: Record<string, string> = {
  // rose
  '카네이션': 'rose', '리시안셔스': 'rose', '천일홍': 'rose', '작약': 'rose',
  '포인세티아': 'rose', '스위트피': 'rose', '프리지아': 'rose', '장미': 'rose',
  '맨드라미': 'rose', '쿠르쿠마': 'rose', '아이리스': 'rose', '라넌큘러스': 'rose',
  '자스민': 'rose', '목련': 'rose', '수련': 'rose',
  // lily
  '백합': 'lily', '알스트로메리아': 'lily', '아마릴리스': 'lily', '클레마티스': 'lily', '네리네': 'lily',
  // cosmos
  '코스모스': 'cosmos', '동백꽃': 'cosmos',
  // gerbera
  '해바라기': 'gerbera', '거베라': 'gerbera', '블루데이지': 'gerbera',
  '아네모네': 'gerbera', '소국': 'gerbera', '수선화': 'gerbera',
  // dahlia
  '다알리아': 'dahlia', '퐁퐁': 'dahlia', '국화': 'dahlia', '스카비오사': 'dahlia', '메리골드': 'dahlia',
  // lavender
  '스타티스': 'lavender', '용담': 'lavender', '히아신스': 'lavender', '스토크': 'lavender',
  '델피늄': 'lavender', '라일락': 'lavender', '라벤더': 'lavender', '금어초': 'lavender',
  '글라디올러스': 'lavender', '히페리쿰': 'lavender', '왁스플라워': 'lavender',
  // rice
  '안개꽃': 'rice', '라이스플라워': 'rice', '수국': 'rice', '백공작': 'rice', '불로초': 'rice', '미스티블루': 'rice',
  // astilbe
  '아스틸베': 'astilbe', '베로니카': 'astilbe',
  // anthurium
  '안스리움': 'anthurium',
  // calla
  '칼라': 'calla',
  // tulip
  '튤립': 'tulip',
  // eucalyptus
  '유칼립투스': 'eucalyptus',
  // cotton
  '목화': 'cotton',
  // lagurus
  '라그라스': 'lagurus',
};

const SINGLE_COLOR_CATEGORIES = new Set(['eucalyptus', 'cotton', 'lagurus']);

/** SVG 자체에 줄기가 포함된 카테고리 — 별도 CSS 줄기 불필요 */
export const STEM_BUILT_IN_CATEGORIES = new Set(['eucalyptus', 'lagurus', 'cotton', 'rice', 'astilbe']);
export const STEM_COLOR = '#96bd86';
export const STEM_HEIGHT = 40;
export const STEM_WIDTH = 4;

const CATEGORY_COLORS: Record<string, FlowerColor[]> = {
  rose: ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'],
  lily: ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'],
  cosmos: ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'],
  gerbera: ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'],
  dahlia: ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'],
  lavender: ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'],
  rice: ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'],
  astilbe: ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'],
  anthurium: ['pink', 'red', 'white'],
  calla: ['orange', 'pink', 'purple', 'white', 'yellow'],
  tulip: ['orange', 'pink', 'purple', 'red', 'white', 'yellow'],
};

const COLOR_FALLBACK_ORDER: FlowerColor[] = ['pink', 'white', 'red', 'orange', 'purple', 'yellow', 'blue', 'green'];

function hexToColorName(hex: string): FlowerColor {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {return 'white';}

  const d = max - min;
  const s = d / (1 - Math.abs(2 * l - 1));

  if (l >= 0.9 || s < 0.1) {return 'white';}

  let h = 0;
  if (max === r) {h = ((g - b) / d + 6) % 6 * 60;} else if (max === g) {h = ((b - r) / d + 2) * 60;} else {h = ((r - g) / d + 4) * 60;}

  if (l >= 0.65 && (h >= 320 || h < 30)) {return 'pink';}
  if (h >= 345 || h < 20) {return 'red';}
  if (h >= 20 && h < 50) {return 'orange';}
  if (h >= 50 && h < 75) {return 'yellow';}
  if (h >= 75 && h < 170) {return 'green';}
  if (h >= 170 && h < 255) {return 'blue';}
  if (h >= 255 && h < 320) {return 'purple';}
  return 'pink';
}

export function getFlowerSvgUrl(name: string, hex: string): string {
  const category = FLOWER_CATEGORY_MAP[name] ?? 'rose';

  if (SINGLE_COLOR_CATEGORIES.has(category)) {
    return `/svgs/flowers/${category}.svg`;
  }

  const targetColor = hexToColorName(hex);
  const availableColors = CATEGORY_COLORS[category] ?? COLOR_FALLBACK_ORDER;

  const color = availableColors.includes(targetColor)
    ? targetColor
    : COLOR_FALLBACK_ORDER.find((c) => availableColors.includes(c)) ?? availableColors[0];

  return `/svgs/flowers/${category}/${color}.svg`;
}

// Wrap-front SVG: viewBox 296.06×176.88, rendered w-full (330px), anchored bottom-0
// Inner V-boundary key points (canvas coords): (0,133)→(89,240)→(165,251)→(241,240)→(330,133)
const _WF_SCALE = CANVAS / 296.06;
const _WF_SVG_TOP = CANVAS - 176.88 * _WF_SCALE;        // ≈ 133
const _WF_KNEE_X = 79.71 * _WF_SCALE;                   // ≈ 89 (canvas x of knee)
const _WF_KNEE_Y = _WF_SVG_TOP + 96.05 * _WF_SCALE;     // ≈ 240 (canvas y of knee)
const _WF_CENTER_V_Y = _WF_SVG_TOP + 105.54 * _WF_SCALE; // ≈ 251 (canvas y of V bottom)
const _WF_KNEE_ABS_X = CENTER - _WF_KNEE_X;             // absX from center to knee ≈ 76

/** wrap-front 내부 경계선의 y 좌표 (드래그 y 최대값 계산용) */
export function wrapFrontTopY(canvasX: number): number {
  const absX = Math.abs(canvasX - CENTER);
  if (absX >= CENTER) { return _WF_SVG_TOP; }
  if (absX <= _WF_KNEE_ABS_X) {
    const t = absX / _WF_KNEE_ABS_X;
    return _WF_CENTER_V_Y - t * (_WF_CENTER_V_Y - _WF_KNEE_Y);
  }
  const t = (absX - _WF_KNEE_ABS_X) / (CENTER - _WF_KNEE_ABS_X);
  return _WF_KNEE_Y - t * (_WF_KNEE_Y - _WF_SVG_TOP);
}

export function computePositions(count: number, sizes: number[]): { x: number; y: number }[] {
  if (count === 0) {return [];}
  if (count === 1) {return [{ x: CENTER, y: CENTER }];}

  const positions: { x: number; y: number }[] = [];
  positions.push({ x: CENTER, y: CENTER });

  let placed = 1;
  let ring = 1;
  const baseRadius = sizes[0] * 0.9;

  while (placed < count) {
    const radius = baseRadius * ring;
    const circumference = 2 * Math.PI * radius;
    const maxInRing = Math.max(1, Math.floor(circumference / (sizes[ring] * 0.8)));
    const inThisRing = Math.min(maxInRing, count - placed);

    for (let i = 0; i < inThisRing; i++) {
      const startAngle = -Math.PI;
      const endAngle = 0;
      const angle = startAngle + ((endAngle - startAngle) * (i + 0.5)) / inThisRing;
      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * Math.sin(angle) * 0.8;
      positions.push({
        x: Math.max(sizes[ring] / 2, Math.min(CANVAS - sizes[ring] / 2, x)),
        y: Math.max(sizes[ring] / 2, Math.min(CANVAS - sizes[ring] / 2, y)),
      });
      placed++;
    }
    ring++;
  }

  return positions;
}
