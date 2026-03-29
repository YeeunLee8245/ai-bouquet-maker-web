'use client';

import { useMemo } from 'react';
import { useSvgContent } from '@/shared/lib/use-svg-content';
import {
  FLOWER_SVG_MAP,
  FLOWER_SIZE,
  DEFAULT_SVG,
  computePositions,
} from '@entities/flower/model/bouquet-layout';
import type { BouquetDetailData, BouquetDetailFlower } from '../_types';

// ── StaticFlower ──────────────────────────────────────────────

type TFlowerItem = {
  id: string;
  svgUrl: string;
  color: string;
  x: number;
  y: number;
  size: number;
};

function StaticFlower({ svgUrl, color, x, y, size }: Omit<TFlowerItem, 'id'>) {
  const svgContent = useSvgContent(svgUrl, color);

  if (!svgContent) {return null;}

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
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
}

// ── BouquetPreviewSection ─────────────────────────────────────

type TProps = {
  flowers: BouquetDetailFlower[];
  layout: BouquetDetailData['layout'];
};

export default function BouquetPreviewSection({ flowers, layout }: TProps) {
  const items = useMemo<TFlowerItem[]>(() => {
    if (layout?.items.length) {
      return layout.items.map((item, i) => {
        const flower = flowers.find((f) => f.flower_id === item.flower_id);
        const name = flower?.flower_name ?? '';
        const { svgUrl = DEFAULT_SVG, size = FLOWER_SIZE } = FLOWER_SVG_MAP[name] ?? {};
        return {
          id: `${item.flower_id}-${item.flower_meaning_id}-${i}`,
          svgUrl,
          color: item.color ?? flower?.color ?? '#ff69b4',
          x: item.x,
          y: item.y,
          size,
        };
      });
    }

    const flat: { svgUrl: string; color: string; size: number }[] = [];
    for (const flower of flowers) {
      const { svgUrl = DEFAULT_SVG, size = FLOWER_SIZE } = FLOWER_SVG_MAP[flower.flower_name] ?? {};
      for (let i = 0; i < flower.quantity; i++) {
        flat.push({ svgUrl, color: flower.color, size });
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
        className='relative overflow-hidden rounded-4 border-1 border-gray-100 bg-amber-100'
        style={{ width: 330, height: 330 }}
      >
        {items.map((item) => (
          <StaticFlower
            key={item.id}
            svgUrl={item.svgUrl}
            color={item.color}
            x={item.x}
            y={item.y}
            size={item.size}
          />
        ))}
        {items.length === 0 && (
          <div className='flex items-center justify-center h-full text-body-md text-gray-300'>
            꽃을 추가해 주세요
          </div>
        )}
      </div>
    </div>
  );
}
