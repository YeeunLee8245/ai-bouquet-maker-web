'use client';

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { bouquetFlowersAtom } from '../../../_model/bouquet-form.atoms';
import {
  FLOWER_SVG_MAP,
  FLOWER_SIZE,
  DEFAULT_SVG,
  computePositions,
} from '@/lib/flowers/bouquet-layout';

export type { TPreviewFlower } from '@/lib/flowers/bouquet-layout';

export function useBouquetLayout() {
  const bouquetFlowers = useAtomValue(bouquetFlowersAtom);

  return useMemo(() => {
    const flatFlowers: { svgUrl: string; color: string; name: string; size: number }[] = [];

    for (const flower of bouquetFlowers) {
      for (const cq of flower.colorAndQuantities) {
        for (let i = 0; i < cq.quantity; i++) {
          const { svgUrl = DEFAULT_SVG, size = FLOWER_SIZE } = FLOWER_SVG_MAP[flower.name] ?? {};
          flatFlowers.push({ svgUrl, color: cq.color, name: flower.name, size });
        }
      }
    }

    const positions = computePositions(flatFlowers.length, flatFlowers.map((f) => f.size));

    return flatFlowers.map((f, i) => ({
      id: `flower-${i}`,
      svgUrl: f.svgUrl,
      color: f.color,
      x: positions[i].x,
      y: positions[i].y,
      name: f.name,
      size: f.size,
    }));
  }, [bouquetFlowers]);
}
