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
  '해바라기': { svgUrl: '/flower_assets/sunflower.svg', size: FLOWER_SIZE * 1.4 },
  '수국': { svgUrl: '/flower_assets/hydrangea.svg', size: FLOWER_SIZE * 1.2 },
  '거베라': { svgUrl: '/flower_assets/gerbera.svg' },
  '아이리스': { svgUrl: '/flower_assets/iris.svg' },
  '라넌큘러스': { svgUrl: '/flower_assets/ranunculus.svg' },
  '라일락': { svgUrl: '/flower_assets/lilac.svg', size: FLOWER_SIZE * 1.1 },
  '라벤더': { svgUrl: '/flower_assets/lavender.svg' },
  '금어초': { svgUrl: '/flower_assets/snapdragon.svg' },
  '칼라': { svgUrl: '/flower_assets/calla-lily.svg' },
  '글라디올러스': { svgUrl: '/flower_assets/gladiolus.svg' },
  '자스민': { svgUrl: '/flower_assets/jasmine.svg' },
  '목련': { svgUrl: '/flower_assets/magnolia.svg', size: FLOWER_SIZE * 1.2 },
  '수련': { svgUrl: '/flower_assets/water-lily.svg', size: FLOWER_SIZE * 1.2 },
  '다알리아': { svgUrl: '/flower_assets/dahlia.svg', size: FLOWER_SIZE * 1.3 },
  '알스트로메리아': { svgUrl: '/flower_assets/alstroemeria.svg' },
  '스카비오사': { svgUrl: '/flower_assets/scabiosa.svg' },
  '라이스플라워': { svgUrl: '/flower_assets/rice-flower.svg' },
  '라그라스': { svgUrl: '/flower_assets/bunny-tail.svg' },
  '히페리컴': { svgUrl: '/flower_assets/hypericum.svg' },
  '왁스플라워': { svgUrl: '/flower_assets/waxflower.svg' },
  '베로니카': { svgUrl: '/flower_assets/veronica.svg' },
  '아마릴리스': { svgUrl: '/flower_assets/amaryllis.svg', size: FLOWER_SIZE * 1.4 },
  '리시안셔스': { svgUrl: '/flower_assets/lisianthus.svg' },
  '백합': { svgUrl: '/flower_assets/lily.svg' },
  '스타티스': { svgUrl: '/flower_assets/statice.svg' },
  '천일홍': { svgUrl: '/flower_assets/globe-amaranth.svg' },
  '백공작': { svgUrl: '/flower_assets/white-peacock.svg' },
  '소국': { svgUrl: '/flower_assets/mini-chrysanthemum.svg' },
  '퐁퐁': { svgUrl: '/flower_assets/pompon.svg' },
  '용담': { svgUrl: '/flower_assets/gentian.svg' },
  '불로초': { svgUrl: '/flower_assets/immortelle.svg' },
  '국화': { svgUrl: '/flower_assets/chrysanthemum.svg', size: FLOWER_SIZE * 1.2 },
  '유칼립투스': { svgUrl: '/flower_assets/eucalyptus.svg' },
  '포인세티아': { svgUrl: '/flower_assets/poinsettia.svg', size: FLOWER_SIZE * 1.3 },
  '목화': { svgUrl: '/flower_assets/cotton.svg', size: FLOWER_SIZE * 1.2 },
  '히아신스': { svgUrl: '/flower_assets/hyacinth.svg' },
  '스토크': { svgUrl: '/flower_assets/stock.svg' },
  '델피늄': { svgUrl: '/flower_assets/delphinium.svg' },
  '스위트피': { svgUrl: '/flower_assets/sweet-pea.svg' },
  '프리지아': { svgUrl: '/flower_assets/freesia.svg' },
  '수선화': { svgUrl: '/flower_assets/narcissus.svg' },
  '안스리움': { svgUrl: '/flower_assets/anthurium.svg' },
  '네리네': { svgUrl: '/flower_assets/nerine.svg' },
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
