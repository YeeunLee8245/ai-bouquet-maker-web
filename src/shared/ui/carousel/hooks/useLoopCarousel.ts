import React, { useEffect, useMemo, useRef, useState } from 'react';

type Params = {
  /**
   * 원본 아이템 개수
   */
  length: number;
  /**
   * 현재 선택된 원본 인덱스
   */
  index: number;
  /**
   * 인덱스(원본 기준) 변경 시 호출되는 함수
   */
  onIndexChange: (index: number) => void;
  children: React.ReactNode;
};

const useLoopCarousel = ({ length, index, onIndexChange, children }: Params) => {
  // 렌더링 인덱스(마지막 짭 아이템 | 원본 아이템s | 첫 번째 짭 아이템)
  const [renderIdx, setRenderIdx] = useState<number>(1);
  // 애니메이션 상태(true: transform 변경할 때 애니메이션 진행, false: 짭 아이템에 위치할 때 애니메이션 없이 즉시 위치 변경)
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  // 잠금 상태(true: 잠금, false: 잠금 해제)
  const lockedRef = useRef<boolean>(false);
  // 최신 renderIdx 참조
  const renderIdxRef = useRef<number>(renderIdx);
  // requestAnimationFrame ID 저장
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (length <= 0) { return; }
    lockedRef.current = false;
    setIsAnimating(true);
    const newIdx = index + 1;
    setRenderIdx(newIdx); // 맨앞에 짭 아이템이 있기 때문에 +1 함
    renderIdxRef.current = newIdx;
  }, [length, index]);

  // renderIdx 변경 시 ref 동기화
  useEffect(() => {
    renderIdxRef.current = renderIdx;
  }, [renderIdx]);

  const goPrev = () => {
    if (lockedRef.current) { return; }

    // 진행 중인 requestAnimationFrame이 있으면 cancel
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    lockedRef.current = true;
    // 항상 애니메이션 켜기 (경계에서 점프 중일 때도 보장)
    setIsAnimating(true);
    setRenderIdx((v) => {
      const newVal = v - 1;
      renderIdxRef.current = newVal;
      return newVal;
    });
  };

  const goNext = () => {
    if (lockedRef.current) { return; }

    // 진행 중인 requestAnimationFrame이 있으면 cancel
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    lockedRef.current = true;
    // 항상 애니메이션 켜기 (경계에서 점프 중일 때도 보장)
    setIsAnimating(true);
    setRenderIdx((v) => {
      const newVal = v + 1;
      renderIdxRef.current = newVal;
      return newVal;
    });
  };

  const onTransitionEnd = () => {
    if (length <= 0) { return; }

    // 이미 다음 transition이 시작되었으면 무시 (빠른 스와이프 대응)
    if (!lockedRef.current) { return; }

    const currentIdx = renderIdxRef.current;

    // 맨앞 짭 아이템에 위치할 때 애니메이션 없이 즉시 마지막 원본 아이템으로 이동
    if (currentIdx === 0) {
      setIsAnimating(false);
      setRenderIdx(length);
      renderIdxRef.current = length;
      onIndexChange(length - 1);
      // lock은 useEffect에서 애니메이션이 다시 켜질 때 해제
      return;
    }

    // 맨뒤 짭 아이템에 위치할 때 애니메이션 없이 즉시 첫 번째 원본 아이템으로 이동
    if (currentIdx === length + 1) {
      setIsAnimating(false);
      setRenderIdx(1);
      renderIdxRef.current = 1;
      onIndexChange(0);
      // lock은 useEffect에서 애니메이션이 다시 켜질 때 해제
      return;
    }

    // 원본 아이템에 위치할 때
    // 짭 아이템 인덱스는 원본 아이템 인덱스보다 1 작음
    onIndexChange(currentIdx - 1);
    lockedRef.current = false;
  };

  useEffect(() => {
    if (isAnimating) {
      rafIdRef.current = null;
      return;
    }

    // 프레임 경계 나누기
    // 다음 프레임에서 transition 애니메이션 on(다음 Paint 이벤트 직전에 실행되어 적용됨)
    const id = requestAnimationFrame(() => {
      rafIdRef.current = null;
      setIsAnimating(true);
      // 경계에서 점프 후 애니메이션이 다시 켜지면 lock 해제
      lockedRef.current = false;
    });
    rafIdRef.current = id;

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isAnimating]);

  const items = useMemo(() => {
    const arr = React.Children.toArray(children);
    if (arr.length === 0) { return []; }

    return [
      arr[arr.length - 1],
      ...arr,
      arr[0],
    ];
  }, [children]);

  return {
    items,
    renderIdx,
    isAnimating,
    goPrev,
    goNext,
    onTransitionEnd,
  };
};

export default useLoopCarousel;
