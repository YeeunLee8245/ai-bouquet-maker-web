/**
 * @param index 현재 선택된 인덱스
 * @param length 총 아이템 개수
 * @param onChange 인덱스 변경 시 호출되는 함수
 * @param children 캐러셀 아이템
 */
export type CarouselProps = {
  index: number;
  length: number;
  onIndexChange: (index: number) => void;
  children: React.ReactNode;
};
