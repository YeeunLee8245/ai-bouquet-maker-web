'use client';

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { bouquetFlowersAtom } from '../../../model/bouquet-form.atoms';
import {
  FLOWER_SIZE,
  getFlowerSvgUrl,
  computePositions,
} from '@entities/flower/model/bouquet-layout';

export type { TPreviewFlower } from '@entities/flower/model/bouquet-layout';

export function useBouquetLayout() {
  const bouquetFlowers = useAtomValue(bouquetFlowersAtom);

  return useMemo(() => {
    const flatFlowers: { svgUrl: string; name: string; size: number }[] = [];

    for (const flower of bouquetFlowers) {
      for (const ci of flower.colorInfos) {
        for (let i = 0; i < ci.quantity; i++) {
          flatFlowers.push({
            svgUrl: getFlowerSvgUrl(flower.name, ci.hex),
            name: flower.name,
            size: FLOWER_SIZE,
          });
        }
      }
    }

    const positions = computePositions(flatFlowers.length, flatFlowers.map((f) => f.size));

    return flatFlowers.map((f, i) => ({
      id: `flower-${i}`,
      svgUrl: f.svgUrl,
      x: positions[i].x,
      y: positions[i].y,
      name: f.name,
      size: f.size,
    }));
  }, [bouquetFlowers]);
}
