/**
 * HSL 색상 값을 기반으로 색상 이름을 반환합니다.
 * @param hue - 색상 (0-360)
 * @param saturation - 채도 (0-100)
 * @param lightness - 밝기 (0-100)
 * @returns 색상 이름
 */
export function getColorNameFromHsl(
  hue: number,
  saturation: number,
  lightness: number,
): string {
  // 채도가 낮으면 회색 계열
  if (saturation < 10) {
    if (lightness < 20) {
      return '검정';
    }
    if (lightness > 80) {
      return '흰색';
    }
    return '회색';
  }

  // 밝기가 극단적인 경우
  if (lightness < 15) {
    return '검정';
  }
  if (lightness > 95) {
    return '흰색';
  }

  // Hue 값에 따른 색상 이름
  if (hue < 15 || hue >= 345) {
    return '빨강';
  }
  if (hue < 45) {
    return '주황';
  }
  if (hue < 75) {
    return '노랑';
  }
  if (hue < 150) {
    return '초록';
  }
  if (hue < 195) {
    return '하늘';
  }
  if (hue < 255) {
    return '파랑';
  }
  if (hue < 285) {
    return '남색';
  }
  if (hue < 315) {
    return '보라';
  }
  return '자주';
}

/**
 * HSL 색상 문자열을 생성합니다.
 * @param hue - 색상 (0-360)
 * @param saturation - 채도 (0-100)
 * @param lightness - 밝기 (0-100)
 * @returns HSL 색상 문자열 (예: "hsl(120, 100%, 50%)")
 */
export function hslString(
  hue: number,
  saturation: number,
  lightness: number,
): string {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const COLOR_HEX_MAP: Record<string, string> = {
  // 빨강 계열
  '#A1262C': '빨강',
  '#FF0000': '빨강',

  // 분홍 계열
  '#FFB6C1': '분홍',
  '#FFC0CB': '분홍',

  // 흰색 및 회색 계열 (요청대로 묶음)
  '#FFFFFF': '흰색',
  '#9E9E9E': '회색',
  '#F5F5F5': '흰색',

  // 추가 컬러들...
  '#FF8C00': '주황',
  '#FF8D3E': '주황',
  '#FFE000': '노랑',
  '#FFD700': '노랑',
  '#4CAF50': '초록',
  '#2196F3': '파랑',
  '#9C27B0': '자주',
};

/**
 * DB의 HEX 값을 입력받아 정해진 8가지 한국어 색상명을 반환합니다.
 */
export const getColorNameFromHex = (hex: string): string => {
  const upperHex = hex.toUpperCase();

  // 1. 매칭되는 값이 있으면 즉시 반환
  if (COLOR_HEX_MAP[upperHex]) {
    return COLOR_HEX_MAP[upperHex];
  }

  // 2. 매칭되지 않는 값에 대한 기본 처리 (예: 모두 흰색 혹은 기타)
  return '흰색';
};
