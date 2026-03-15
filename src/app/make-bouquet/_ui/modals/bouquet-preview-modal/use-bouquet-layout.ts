'use client';

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { bouquetFlowersAtom } from '../../../_model/bouquet-form.atoms';

export type TPreviewFlower = {
  id: string;
  svgUrl: string;
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
const FLOWER_SVG_MAP: Record<string, string> = {
  '장미': '/flower_assets/rose.svg',
  '튤립': '/flower_assets/tulip.svg',
  '작약': '/flower_assets/peony.svg',
  '아네모네': '/flower_assets/anemone.svg',
  '메리골드': '/flower_assets/marigold.svg',
  '블루데이지': '/flower_assets/blue-daisy.svg',
  '미스티블루': '/flower_assets/misty-blue.svg',
  '카네이션': '/flower_assets/carnation.svg',
  '코스모스': '/flower_assets/cosmos.svg',
  '동백꽃': '/flower_assets/camellia.svg',
  '아스틸베': '/flower_assets/astilbe.svg',
};

const DEFAULT_SVG = '/flower_assets/rose.svg';

function getFlowerSvgUrl(name: string): string {
  return FLOWER_SVG_MAP[name] ?? DEFAULT_SVG;
}

function computePositions(count: number): { x: number; y: number }[] {
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
  const baseRadius = FLOWER_SIZE * 0.9;

  while (placed < count) {
    const radius = baseRadius * ring;
    const circumference = 2 * Math.PI * radius;
    const maxInRing = Math.max(1, Math.floor(circumference / (FLOWER_SIZE * 0.8)));
    const inThisRing = Math.min(maxInRing, count - placed);

    for (let i = 0; i < inThisRing; i++) {
      // 상단 반원 중심으로 배치 (180도~360도 범위를 중심으로)
      const startAngle = -Math.PI;
      const endAngle = 0;
      const angle = startAngle + ((endAngle - startAngle) * (i + 0.5)) / inThisRing;

      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * Math.sin(angle) * 0.8; // y축 약간 압축

      positions.push({
        x: Math.max(FLOWER_SIZE / 2, Math.min(CANVAS - FLOWER_SIZE / 2, x)),
        y: Math.max(FLOWER_SIZE / 2, Math.min(CANVAS - FLOWER_SIZE / 2, y)),
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
    const flatFlowers: { svgUrl: string; color: string; name: string }[] = [];

    for (const flower of bouquetFlowers) {
      for (const cq of flower.colorAndQuantities) {
        for (let i = 0; i < cq.quantity; i++) {
          flatFlowers.push({
            svgUrl: getFlowerSvgUrl(flower.name),
            color: cq.color,
            name: flower.name,
          });
        }
      }
    }

    const positions = computePositions(flatFlowers.length);

    return flatFlowers.map((f, i) => ({
      id: `flower-${i}`,
      svgUrl: f.svgUrl,
      color: f.color,
      x: positions[i].x,
      y: positions[i].y,
      name: f.name,
    }));
  }, [bouquetFlowers]);
}
