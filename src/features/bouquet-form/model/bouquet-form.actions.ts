import { atom } from 'jotai';
import {
  bouquetNameAtom,
  bouquetOccasionAtom,
  bouquetRecipientAtom,
  bouquetMessageAtom,
  bouquetFlowersAtom,
  bouquetPackagingColorAtom,
  bouquetRibbonColorAtom,
} from './bouquet-form.atoms';
import { selectedFlowersAtom } from '@/shared/model/selected-flowers';
import type { TFlowerCompositionItem, TBouquetDetailInitData } from './bouquet-form.types';
import { fetchSelectedFlowers, TSelectedFlowerDetail } from '@api/recipe-bouquet.api';

const toFlowerCompositionItem = (detail: TSelectedFlowerDetail): TFlowerCompositionItem => ({
  id: detail.id,
  name: detail.name_ko,
  meaningId: detail.colorInfos[0]?.meaningId ?? '',
  keywords: [...new Set(detail.colorInfos.flatMap((c) => c.tags))],
  imageUrl: detail.imageUrl ?? '',
  colorAndQuantities: detail.colorInfos.map((c) => ({ color: c.hex, quantity: 1, meaningId: c.meaningId })),
});

/** [Create] 선택한 꽃을 꽃다발 폼에 초기 세팅 */
export const initBouquetFlowersAtom = atom(null, async (get, set) => {
  const selected = get(selectedFlowersAtom);

  const bouquetFlowers: TFlowerCompositionItem[] = selected.map((f) => ({
    id: f.id,
    name: f.name,
    meaningId: '',
    keywords: [],
    imageUrl: '',
    colorAndQuantities: [],
  }));
  set(bouquetFlowersAtom, bouquetFlowers);

  if (selected.length === 0) { return; }

  try {
    const ids = selected.map((f) => Number(f.id));
    const data = await fetchSelectedFlowers(ids);
    const detailMap = new Map(data.map((d) => [d.id, d]));
    set(bouquetFlowersAtom, bouquetFlowers.map((f) => {
      const detail = detailMap.get(f.id);
      return detail ? toFlowerCompositionItem(detail) : f;
    }));
  } catch {
    // API 실패 시 기존 초기화 데이터 유지
  }
});

/** [Modify] 상세 API 데이터로 폼 전체를 초기 세팅 */
export const initBouquetFormFromDetailAtom = atom(null, async (_get, set, detail: TBouquetDetailInitData) => {
  // 텍스트·포장 atoms 즉시 세팅
  set(bouquetNameAtom, detail.name);
  set(bouquetOccasionAtom, detail.occasion ?? '');
  set(bouquetRecipientAtom, detail.recipient ?? '');
  set(bouquetMessageAtom, detail.message ?? '');
  set(bouquetPackagingColorAtom, detail.wrapping.wrappingColor ?? '');
  set(bouquetRibbonColorAtom, detail.wrapping.ribbonColor ?? '');

  // 꽃 즉시 세팅 (meaningId·imageUrl 임시값)
  const bouquetFlowers: TFlowerCompositionItem[] = detail.flowers.map((f) => ({
    id: f.flower_id,
    name: f.flower_name,
    meaningId: '',
    keywords: f.tags,
    imageUrl: '',
    colorAndQuantities: f.color_and_quantity.map((cq) => ({ ...cq, meaningId: cq.meaningId ?? undefined })),
  }));
  set(bouquetFlowersAtom, bouquetFlowers);

  // 백그라운드: fetchSelectedFlowers로 meaningId·imageUrl 업데이트
  try {
    const ids = detail.flowers.map((f) => Number(f.flower_id));
    const fetched = await fetchSelectedFlowers(ids);
    const detailMap = new Map(fetched.map((d) => [d.id, d]));
    set(bouquetFlowersAtom, bouquetFlowers.map((f) => {
      const d = detailMap.get(f.id);
      return d ? { ...f, meaningId: d.colorInfos[0]?.meaningId ?? f.meaningId, imageUrl: d.imageUrl ?? '', keywords: [...new Set(d.colorInfos.flatMap((c) => c.tags))] } : f;
    }));
  } catch {
    // 실패 시 임시값 유지 (meaningId='', imageUrl='')
  }
});

export const addBouquetFlowerAtom = atom(null, (get, set, detail: TSelectedFlowerDetail): boolean => {
  const flowers = get(bouquetFlowersAtom);
  if (flowers.some((f) => f.id === detail.id)) { return false; }
  set(bouquetFlowersAtom, [...flowers, toFlowerCompositionItem(detail)]);
  const selected = get(selectedFlowersAtom);
  if (!selected.some((f) => f.id === detail.id)) {
    set(selectedFlowersAtom, [...selected, { id: detail.id, name: detail.name_ko }]);
  }
  return true;
});

export const removeBouquetFlowerByIdAtom = atom(null, (get, set, id: string) => {
  set(bouquetFlowersAtom, get(bouquetFlowersAtom).filter((f) => f.id !== id));
  set(selectedFlowersAtom, get(selectedFlowersAtom).filter((f) => f.id !== id));
});

const updateFlowerAt = (
  flowers: TFlowerCompositionItem[],
  index: number,
  updater: (f: TFlowerCompositionItem) => TFlowerCompositionItem,
): TFlowerCompositionItem[] => {
  const updated = [...flowers];
  updated[index] = updater(flowers[index]);
  return updated;
};

export const addFlowerColorAtom = atom(null, (get, set, params: { flowerIndex: number; color: string }) => {
  set(bouquetFlowersAtom, updateFlowerAt(get(bouquetFlowersAtom), params.flowerIndex, (f) => ({
    ...f,
    colorAndQuantities: [...f.colorAndQuantities, { color: params.color, quantity: 1 }],
  })));
});

export const updateFlowerColorAtom = atom(null, (get, set, params: { flowerIndex: number; colorIndex: number; color: string }) => {
  set(bouquetFlowersAtom, updateFlowerAt(get(bouquetFlowersAtom), params.flowerIndex, (f) => ({
    ...f,
    colorAndQuantities: f.colorAndQuantities.map((cq, ci) =>
      ci === params.colorIndex ? { ...cq, color: params.color } : cq,
    ),
  })));
});

export const removeFlowerColorAtom = atom(null, (get, set, params: { flowerIndex: number; colorIndex: number }) => {
  set(bouquetFlowersAtom, updateFlowerAt(get(bouquetFlowersAtom), params.flowerIndex, (f) => ({
    ...f,
    colorAndQuantities: f.colorAndQuantities.filter((_, ci) => ci !== params.colorIndex),
  })));
});

export const plusFlowerColorQuantityAtom = atom(null, (get, set, params: { flowerIndex: number; colorIndex: number }) => {
  set(bouquetFlowersAtom, updateFlowerAt(get(bouquetFlowersAtom), params.flowerIndex, (f) => ({
    ...f,
    colorAndQuantities: f.colorAndQuantities.map((cq, ci) =>
      ci === params.colorIndex ? { ...cq, quantity: cq.quantity + 1 } : cq,
    ),
  })));
});

export const minusFlowerColorQuantityAtom = atom(null, (get, set, params: { flowerIndex: number; colorIndex: number }) => {
  set(bouquetFlowersAtom, updateFlowerAt(get(bouquetFlowersAtom), params.flowerIndex, (f) => ({
    ...f,
    colorAndQuantities: f.colorAndQuantities.map((cq, ci) =>
      ci === params.colorIndex ? { ...cq, quantity: Math.max(1, cq.quantity - 1) } : cq,
    ),
  })));
});

export const resetBouquetFormAtom = atom(null, (_get, set) => {
  set(bouquetNameAtom, '');
  set(bouquetOccasionAtom, '');
  set(bouquetRecipientAtom, '');
  set(bouquetMessageAtom, '');
  set(bouquetFlowersAtom, []);
  set(bouquetPackagingColorAtom, '');
  set(bouquetRibbonColorAtom, '');
});
