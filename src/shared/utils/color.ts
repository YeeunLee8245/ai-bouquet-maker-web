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
