const MARGIN = 16;

export type TAnchorPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * triggerEl 기준으로 node를 position에 따라 fixed 배치.
 * 뷰포트 경계를 초과하면 반대 방향으로 fallback하고, 그래도 넘치면 maxWidth를 조정한다.
 */
export function applyAnchorPosition(
  node: HTMLElement,
  triggerEl: HTMLElement,
  position: TAnchorPosition,
  gap = 6,
): void {
  const triggerRect = triggerEl.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const pageWidth = document.body.clientWidth;

  let top: number;
  let left: number;
  let maxWidth: number | undefined;

  if (position.startsWith('top')) {
    top = triggerRect.top - nodeRect.height - gap;
  } else {
    top = triggerRect.bottom + gap;
  }

  if (position.endsWith('right')) {
    left = triggerRect.left;
    if (left + nodeRect.width > pageWidth - MARGIN) {
      left = triggerRect.right - nodeRect.width;
      if (left < MARGIN) {
        left = MARGIN;
        maxWidth = pageWidth - MARGIN * 2;
      }
    }
  } else {
    left = triggerRect.right - nodeRect.width;
    if (left < MARGIN) {
      left = triggerRect.left;
      if (left + nodeRect.width > pageWidth - MARGIN) {
        left = MARGIN;
        maxWidth = pageWidth - MARGIN * 2;
      }
    }
  }

  node.style.position = 'fixed';
  node.style.top = `${top}px`;
  node.style.left = `${left}px`;
  if (maxWidth !== undefined) {
    node.style.maxWidth = `${maxWidth}px`;
  }
}
