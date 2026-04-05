'use client';

import { useRef, useCallback } from 'react';
import { useSvgContent } from './use-svg-content';

type TProps = {
  svgUrl: string;
  color: string;
  x: number;
  y: number;
  size: number;
  selected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
};

// const FLOWER_SIZE = 60;
const CANVAS = 330;

export default function DraggableFlower({
  svgUrl,
  size,
  color,
  x,
  y,
  selected,
  onSelect,
  onMove,
}: TProps) {
  const svgContent = useSvgContent(svgUrl, color);
  const dragging = useRef(false);
  const offset = useRef({ dx: 0, dy: 0 });

  const clamp = (size: number, val: number) =>
    Math.max(size / 2, Math.min(CANVAS - size / 2, val));

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      dragging.current = true;
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
      if (!dragging.current) {
        return;
      }
      const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
      const newX = clamp(size, e.clientX - rect.left - offset.current.dx);
      const newY = clamp(size, e.clientY - rect.top - offset.current.dy);
      onMove(newX, newY);
    },
    [onMove, size],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      dragging.current = false;
      onSelect();
    },
    [onSelect],
  );

  if (!svgContent) {
    return null;
  }

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
        zIndex: selected ? 10 : 1,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* // TODO: yeeun 개선 필요 */}
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      {selected && (
        <div
          className='absolute inset-0 pointer-events-none rounded-full border-2 border-blue-500'
        />
      )}
    </div>
  );
}
