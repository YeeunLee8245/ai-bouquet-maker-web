/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useCallback } from 'react';

type TProps = {
  svgUrl: string;
  x: number;
  y: number;
  size: number;
  onMove: (x: number, y: number) => void;
};

const CANVAS = 330;

export default function DraggableFlower({ svgUrl, size, x, y, onMove }: TProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ dx: 0, dy: 0 });

  const clamp = (s: number, val: number) => Math.max(s / 2, Math.min(CANVAS - s / 2, val));

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragging.current = true;
      if (divRef.current) {divRef.current.style.zIndex = '10';}
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
      const newX = clamp(size, e.clientX - rect.left - offset.current.dx);
      const newY = clamp(size, e.clientY - rect.top - offset.current.dy);
      onMove(newX, newY);
    },
    [onMove, size],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragging.current = false;
    if (divRef.current) {divRef.current.style.zIndex = '0';}
  }, []);

  return (
    <div
      ref={divRef}
      role='button'
      tabIndex={0}
      className='absolute touch-none'
      style={{
        width: size,
        height: size,
        left: x - size / 2,
        top: y - size / 2,
        cursor: 'grab',
        zIndex: 0,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <img src={svgUrl} width={size} height={size} alt='' draggable={false} />
    </div>
  );
}
