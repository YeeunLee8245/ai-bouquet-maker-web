/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useCallback, useState } from 'react';
import {
  CANVAS,
  STEM_BUILT_IN_CATEGORIES,
  STEM_COLOR,
  STEM_HEIGHT,
  STEM_WIDTH,
  Z_FLOWER_MAX,
  flowerZIndex,
  wrapFrontTopY,
} from '@entities/flower/model/bouquet-layout';

type TProps = {
  svgUrl: string;
  x: number;
  y: number;
  size: number;
  onMove: (x: number, y: number) => void;
  onMoveEnd?: () => void;
};

function getCategory(svgUrl: string): string {
  return (svgUrl.split('/')[3] ?? '').replace('.svg', '');
}

export default function DraggableFlower({ svgUrl, size, x, y, onMove, onMoveEnd }: TProps) {
  const showStem = !STEM_BUILT_IN_CATEGORIES.has(getCategory(svgUrl));
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ dx: 0, dy: 0 });

  const clampX = (s: number, val: number) => Math.max(s / 2, Math.min(CANVAS - s / 2, val));
  const clampY = (s: number, cx: number, val: number) =>
    Math.max(s / 2, Math.min(wrapFrontTopY(cx) - s / 2, val));

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragging.current = true;
      setIsDragging(true);
      const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
      offset.current = {
        dx: e.clientX - rect.left - x,
        dy: e.clientY - rect.top - y,
      };
    },
    [x, y],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) {return;}
      const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
      const newX = clampX(size, e.clientX - rect.left - offset.current.dx);
      const newY = clampY(size, newX, e.clientY - rect.top - offset.current.dy);
      onMove(newX, newY);
    },
    [onMove, size],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragging.current = false;
    setIsDragging(false);
    onMoveEnd?.();
  }, [onMoveEnd]);

  return (
    <div
      role='button'
      tabIndex={0}
      className='absolute touch-none'
      style={{
        width: size,
        height: size,
        left: x - size / 2,
        top: y - size / 2,
        cursor: 'grab',
        zIndex: isDragging ? Z_FLOWER_MAX : flowerZIndex(y),
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <img src={svgUrl} width={size} height={size} alt='' draggable={false} style={{ position: 'relative', zIndex: 1 }} />
      {showStem && (
        <div
          style={{
            position: 'absolute',
            zIndex: 0,
            width: STEM_WIDTH,
            height: STEM_HEIGHT,
            backgroundColor: STEM_COLOR,
            left: (size - STEM_WIDTH) / 2,
            top: size - (size / 10 + 5),
            borderRadius: '0 0 2px 2px',
          }}
        />
      )}
    </div>
  );
}
