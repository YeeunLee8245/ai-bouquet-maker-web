/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import {
  getFlowerSvgUrl,
  computePositions,
  computeFlowerSize,
  flowerZIndex,
  Z_WRAP_BACK,
  Z_WRAP_FRONT,
  Z_RIBBON,
  STEM_BUILT_IN_CATEGORIES,
  STEM_COLOR,
  STEM_HEIGHT,
  STEM_WIDTH,
  CANVAS,
} from '@entities/flower/model/bouquet-layout';
import { BouquetWrapBackSvg, BouquetWrapFrontSvg, BouquetRibbonSvg } from '@entities/flower/ui';
import type { IBouquetDetailData, IBouquetDetailFlower } from '../_types';

// ── StaticFlower ──────────────────────────────────────────────

type TFlowerItem = {
  id: string;
  svgUrl: string;
  x: number;
  y: number;
  size: number;
};

function getCategory(svgUrl: string): string {
  return (svgUrl.split('/')[3] ?? '').replace('.svg', '');
}

function StaticFlower({ svgUrl, x, y, size }: Omit<TFlowerItem, 'id'>) {
  const showStem = !STEM_BUILT_IN_CATEGORIES.has(getCategory(svgUrl));

  return (
    <div
      className='absolute pointer-events-none'
      style={{
        width: size,
        height: size,
        left: x - size / 2,
        top: y - size / 2,
        zIndex: flowerZIndex(y),
      }}
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
            top: size - (size / 10 + 10),
            borderRadius: '0 0 2px 2px',
          }}
        />
      )}
    </div>
  );
}

// ── BouquetPreviewSection ─────────────────────────────────────

type TProps = {
  flowers: IBouquetDetailFlower[];
  layout: IBouquetDetailData['layout'];
  wrappingColor?: string | null;
  ribbonColor?: string | null;
};

export default function BouquetPreviewSection({ flowers, layout, wrappingColor, ribbonColor }: TProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(CANVAS);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {return;}
    const update = () => setCanvasSize(Math.min(CANVAS, el.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const posScale = canvasSize / CANVAS;

  const items = useMemo<TFlowerItem[]>(() => {
    if (layout?.items.length) {
      const size = computeFlowerSize(layout.items.length);
      return layout.items.map((item, i) => {
        const flower = flowers.find((f) => f.flower_id === item.flower_id);
        const name = flower?.flower_name ?? '';
        const color = item.color ?? flower?.color_and_quantity?.[0]?.color ?? '#ff69b4';
        return {
          id: `${item.flower_id}-${i}`,
          svgUrl: getFlowerSvgUrl(name, color),
          x: item.x,
          y: item.y,
          size,
        };
      });
    }

    const flat: { svgUrl: string }[] = [];
    for (const flower of flowers) {
      for (const { color, quantity } of flower.color_and_quantity) {
        for (let i = 0; i < quantity; i++) {
          flat.push({ svgUrl: getFlowerSvgUrl(flower.flower_name, color) });
        }
      }
    }

    const size = computeFlowerSize(flat.length);
    const positions = computePositions(flat.length, flat.map(() => size));
    return flat.map((f, i) => ({
      id: `flower-${i}`,
      ...f,
      size,
      x: positions[i].x,
      y: positions[i].y,
    }));
  }, [flowers, layout]);

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: CANVAS, margin: '0 auto' }}>
      <div
        className='relative overflow-hidden rounded-4 border-1 border-gray-100 bg-amber-200'
        style={{ width: canvasSize, height: canvasSize, isolation: 'isolate' }}
      >
        {/* 포장지 뒷면 */}
        <BouquetWrapBackSvg
          color={wrappingColor || undefined}
          className='absolute left-0 w-full pointer-events-none'
          style={{ zIndex: Z_WRAP_BACK }}
        />

        {/* 꽃 (y 기반 z-index, 아래일수록 앞) */}
        {items.map((item) => (
          <StaticFlower
            key={item.id}
            svgUrl={item.svgUrl}
            x={item.x * posScale}
            y={item.y * posScale}
            size={item.size * posScale}
          />
        ))}

        {items.length === 0 && (
          <div className='absolute inset-0 flex items-center justify-center text-body-md text-gray-300' style={{ zIndex: 3 }}>
            꽃을 추가해 주세요
          </div>
        )}

        {/* 포장지 앞면 */}
        <BouquetWrapFrontSvg
          color={wrappingColor || undefined}
          className='absolute bottom-0 left-0 w-full pointer-events-none'
          style={{ zIndex: Z_WRAP_FRONT }}
        />

        {/* 리본 */}
        <BouquetRibbonSvg
          color={ribbonColor || undefined}
          className='absolute left-1/2 -translate-x-1/2 pointer-events-none'
          style={{ zIndex: Z_RIBBON, width: 114 * posScale, bottom: 48 * posScale }}
        />
      </div>
    </div>
  );
}
