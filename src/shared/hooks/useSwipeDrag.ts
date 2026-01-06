import { useRef, useCallback } from 'react';

type Params = {
  onPrev: VoidFunction;
  onNext: VoidFunction;
  /**
   * 스와이프 거리 px 기준
   */
  thresholdTouch?: number,
  thresholdMouse?: number,
};

const useSwipeDrag = ({ onPrev, onNext, thresholdTouch = 10, thresholdMouse = 10 }: Params) => {
  const startX = useRef(0);
  const deltaX = useRef(0);
  const dragging = useRef(false);
  const pointerTypeRef = useRef<'mouse' | 'touch' | 'pen'>('touch');

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointerTypeRef.current = e.pointerType;
      startX.current = e.clientX;
      deltaX.current = 0;
      dragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) { return; }
    // x축 거리 계산(현재 위치 - 시작 위치)
    deltaX.current = e.clientX - startX.current;
  };

  const onPointerUp = () => {
    if (!dragging.current) { return; }

    const threshold =
      pointerTypeRef.current === 'mouse'
        ? thresholdMouse
        : thresholdTouch;

    if (deltaX.current > threshold) {
      onPrev();
    } else if (deltaX.current < -threshold) {
      onNext();
    }

    dragging.current = false;
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };
};

export default useSwipeDrag;
