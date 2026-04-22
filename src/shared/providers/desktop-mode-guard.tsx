'use client';

import { useEffect } from 'react';

/**
 * Chrome Android Desktop mode가 OAuth 리다이렉트 체인 중 자동 활성화되는 경우,
 * viewport가 실제 화면보다 훨씬 넓어져 앱이 작게 축소 렌더링됨.
 * 실제 터치 기기에서 viewport가 물리 화면보다 과도하게 넓을 때 viewport meta를 강제 재설정.
 */
function DesktopModeGuard() {
  useEffect(() => {
    const isTouchDevice =
      navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    if (!isTouchDevice) { return; }

    const physicalWidth = window.screen.width;
    const viewportWidth = window.innerWidth;
    if (viewportWidth <= physicalWidth * 1.3) { return; }

    const meta = document.querySelector('meta[name=viewport]');
    if (!meta) { return; }

    meta.setAttribute(
      'content',
      `width=${physicalWidth}, initial-scale=1, maximum-scale=1, user-scalable=no`,
    );
  }, []);

  return null;
}

export default DesktopModeGuard;
