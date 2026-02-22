import type { RefObject } from 'react';

/**
 * 텍스트 카운트를 DOM 요소의 data-count 속성에 업데이트합니다.
 * @param ref - 업데이트할 DOM 요소의 ref
 * @param length - 표시할 텍스트 길이
 */
export function updateTextCount(
  ref: RefObject<HTMLElement | null>,
  length: number,
): void {
  if (!ref.current) {
    return;
  }
  ref.current.dataset.count = length.toString();
}
