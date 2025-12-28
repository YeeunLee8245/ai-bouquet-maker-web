'use client';

import * as React from 'react';

type TProps = {
  /** 이 px 이상 스크롤되면 버튼 노출 */
  showAfterPx?: number
  /** 버튼 텍스트/아이콘 */
  children?: React.ReactNode
  className?: string
  /** 고정 위치 */
  position?: 'bottom-right' | 'bottom-left'
};

function prefersReducedMotion() {
  if (typeof window === 'undefined') {return true;}
  // OS 설정 단에서 동작줄이기 옵션 설정 반영(eg. macOS의 시스템 설정 > 접근성 > 동작줄이기 옵션)
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export function ScrollToTopButton({
  showAfterPx = 300,
  children = null,
  className,
  position = 'bottom-right',
}: TProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY >= showAfterPx);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfterPx]);

  const onClick = () => {
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  };

  const pos =
    position === 'bottom-right'
      ? 'right-4 bottom-4'
      : 'left-4 bottom-4';

  if (!visible) {return null;}

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll to top"
      // 디자인 확정되면 커스터마이징 필요(props로 variant 받아서 처리)
      className={[
        'fixed z-50 rounded-full px-4 py-3 shadow',
        'bg-black/80 text-white hover:bg-black',
        pos,
        className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
