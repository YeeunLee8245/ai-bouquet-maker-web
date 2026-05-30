'use client';

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { bouquetFlowersAtom, bouquetLayoutAtom } from '../../../model/bouquet-form.atoms';
import {
  getFlowerSvgUrl,
  computePositions,
  computeFlowerSize,
} from '@entities/flower/model/bouquet-layout';

export type { TPreviewFlower } from '@entities/flower/model/bouquet-layout';

export function useBouquetLayout() {
  const bouquetFlowers = useAtomValue(bouquetFlowersAtom);
  const savedLayout = useAtomValue(bouquetLayoutAtom);

  return useMemo(() => {
    const flatFlowers: { svgUrl: string; name: string; flowerId: string; meaningId: string; color: string }[] = [];

    for (const flower of bouquetFlowers) {
      for (const ci of flower.colorInfos) {
        for (let i = 0; i < ci.quantity; i++) {
          flatFlowers.push({
            svgUrl: getFlowerSvgUrl(flower.name, ci.hex),
            name: flower.name,
            flowerId: flower.id,
            meaningId: ci.meaningId || flower.meaningId,
            color: ci.hex,
          });
        }
      }
    }

    const size = computeFlowerSize(flatFlowers.length);
    const positions = savedLayout?.length === flatFlowers.length
      ? savedLayout.map((item) => ({ x: item.x, y: item.y }))
      : computePositions(flatFlowers.length, flatFlowers.map(() => size));

    return flatFlowers.map((f, i) => ({
      id: `flower-${i}`,
      svgUrl: f.svgUrl,
      x: positions[i].x,
      y: positions[i].y,
      name: f.name,
      size,
      flowerId: f.flowerId,
      meaningId: f.meaningId,
      color: f.color,
    }));
  }, [bouquetFlowers, savedLayout]);
}
