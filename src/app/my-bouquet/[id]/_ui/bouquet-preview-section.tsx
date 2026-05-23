/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo } from 'react';
import {
  FLOWER_SIZE,
  getFlowerSvgUrl,
  computePositions,
  STEM_BUILT_IN_CATEGORIES,
  STEM_COLOR,
  STEM_HEIGHT,
  STEM_WIDTH,
} from '@entities/flower/model/bouquet-layout';
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
            top: size - 10,
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
};

export default function BouquetPreviewSection({ flowers, layout }: TProps) {
  const items = useMemo<TFlowerItem[]>(() => {
    if (layout?.items.length) {
      return layout.items.map((item, i) => {
        const flower = flowers.find((f) => f.flower_id === item.flower_id);
        const name = flower?.flower_name ?? '';
        const color = item.color ?? flower?.color_and_quantity?.[0]?.color ?? '#ff69b4';
        return {
          id: `${item.flower_id}-${i}`,
          svgUrl: getFlowerSvgUrl(name, color),
          x: item.x,
          y: item.y,
          size: FLOWER_SIZE,
        };
      });
    }

    const flat: { svgUrl: string; size: number }[] = [];
    for (const flower of flowers) {
      for (const { color, quantity } of flower.color_and_quantity) {
        for (let i = 0; i < quantity; i++) {
          flat.push({ svgUrl: getFlowerSvgUrl(flower.flower_name, color), size: FLOWER_SIZE });
        }
      }
    }

    const positions = computePositions(flat.length, flat.map((f) => f.size));
    return flat.map((f, i) => ({
      id: `flower-${i}`,
      ...f,
      x: positions[i].x,
      y: positions[i].y,
    }));
  }, [flowers, layout]);

  return (
    <div className='flex justify-center'>
      <div
        className='relative overflow-hidden rounded-4 border-1 border-gray-100 bg-amber-200'
        style={{ width: 330, height: 330, isolation: 'isolate' }}
      >
        {/* 포장지 뒷면 (z: -1) */}
        <img
          src='/svgs/bouquet-wrap-back.svg'
          className='absolute left-0 w-full pointer-events-none'
          style={{ zIndex: -1 }}
          alt=''
        />

        {/* 꽃 (z: 0) */}
        {items.map((item) => (
          <StaticFlower
            key={item.id}
            svgUrl={item.svgUrl}
            x={item.x}
            y={item.y}
            size={item.size}
          />
        ))}

        {items.length === 0 && (
          <div className='absolute inset-0 flex items-center justify-center text-body-md text-gray-300' style={{ zIndex: 3 }}>
            꽃을 추가해 주세요
          </div>
        )}

        {/* 포장지 앞면 (z: 1) */}
        <img
          src='/svgs/bouquet-wrap-front.svg'
          className='absolute bottom-0 left-0 w-full pointer-events-none'
          style={{ zIndex: 1 }}
          alt=''
        />

        {/* 리본 (z: 2) */}
        <img
          src='/svgs/bouquet-ribbon.svg'
          className='absolute bottom-[48px] left-1/2 -translate-x-1/2 pointer-events-none'
          style={{ zIndex: 2, width: 114 }}
          alt=''
        />
      </div>
    </div>
  );
}
