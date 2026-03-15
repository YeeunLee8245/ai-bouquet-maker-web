'use client';

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { bouquetFlowersAtom } from '../../../_model/bouquet-form.atoms';

export type TPreviewFlower = {
  id: string;
  svgUrl: string;
  size: number;
  color: string;
  x: number;
  y: number;
  name: string;
};

const CANVAS = 330;
const FLOWER_SIZE = 60;
const CENTER = CANVAS / 2;

/**
 * 꽃 이름(한글) → 로컬 SVG 파일 매핑
 * public/flower_assets/ 내 SVG를 임시로 활용
 */
const FLOWER_SVG_MAP: Record<string, { svgUrl: string; size?: number }> = {
  '장미': { svgUrl: '/flower_assets/rose.svg' },
  '튤립': { svgUrl: '/flower_assets/tulip.svg' },
  '작약': { svgUrl: '/flower_assets/peony.svg' },
  '아네모네': { svgUrl: '/flower_assets/anemone.svg' },
  '메리골드': { svgUrl: '/flower_assets/marigold.svg' },
  '블루데이지': { svgUrl: '/flower_assets/blue-daisy.svg' },
  '미스티블루': { svgUrl: '/flower_assets/misty-blue.svg' },
  '카네이션': { svgUrl: '/flower_assets/carnation.svg' },
  '코스모스': { svgUrl: '/flower_assets/cosmos.svg' },
  '동백꽃': { svgUrl: '/flower_assets/camellia.svg' },
  '아스틸베': { svgUrl: '/flower_assets/astilbe.svg' },
  '맨드라미': { svgUrl: '/flower_assets/cockscomb.svg', size: FLOWER_SIZE * 2 },
  '클레마티스': { svgUrl: '/flower_assets/clematis.svg' },
  '쿠르쿠마': { svgUrl: '/flower_assets/curcuma.svg' },
  '안개꽃': { svgUrl: '/flower_assets/babys-breath.svg' },
};

const DEFAULT_SVG = '/flower_assets/rose.svg';

function computePositions(count: number, sizes: number[]): { x: number; y: number }[] {
  if (count === 0) {
    return [];
  }
  if (count === 1) {
    return [{ x: CENTER, y: CENTER }];
  }

  const positions: { x: number; y: number }[] = [];

  // 중심에 첫 번째 꽃
  positions.push({ x: CENTER, y: CENTER });

  // 동심원 배치 (안쪽부터)
  let placed = 1;
  let ring = 1;
  const baseRadius = sizes[0] * 0.9;

  while (placed < count) {
    const radius = baseRadius * ring;
    const circumference = 2 * Math.PI * radius;
    const maxInRing = Math.max(1, Math.floor(circumference / (sizes[ring] * 0.8)));
    const inThisRing = Math.min(maxInRing, count - placed);

    for (let i = 0; i < inThisRing; i++) {
      // 상단 반원 중심으로 배치 (180도~360도 범위를 중심으로)
      const startAngle = -Math.PI;
      const endAngle = 0;
      const angle = startAngle + ((endAngle - startAngle) * (i + 0.5)) / inThisRing;

      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * Math.sin(angle) * 0.8; // y축 약간 압축

      positions.push({
        x: Math.max(sizes[ring] / 2, Math.min(CANVAS - sizes[ring] / 2, x)),
        y: Math.max(sizes[ring] / 2, Math.min(CANVAS - sizes[ring] / 2, y)),
      });
      placed++;
    }
    ring++;
  }

  return positions;
}

export function useBouquetLayout(): TPreviewFlower[] {
  const bouquetFlowers = useAtomValue(bouquetFlowersAtom);

  return useMemo(() => {
    // bouquetFlowersAtom 데이터에서 개별 꽃 목록 생성
    const flatFlowers: { svgUrl: string; color: string; name: string; size: number }[] = [];

    for (const flower of bouquetFlowers) {
      for (const cq of flower.colorAndQuantities) {
        for (let i = 0; i < cq.quantity; i++) {
          const { svgUrl = DEFAULT_SVG, size = FLOWER_SIZE } = FLOWER_SVG_MAP[flower.name] ?? {};
          flatFlowers.push({
            svgUrl,
            color: cq.color,
            name: flower.name,
            size,
          });
        }
      }
    }

    const positions = computePositions(flatFlowers.length, flatFlowers.map(f => f.size));

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
