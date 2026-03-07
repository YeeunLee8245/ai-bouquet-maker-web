import { atom } from 'jotai';
import {
  bouquetNameAtom,
  bouquetOccasionAtom,
  bouquetRecipientAtom,
  bouquetMessageAtom,
  bouquetFlowersAtom,
} from './bouquet-form.atoms';
import { selectedFlowersAtom } from '@/shared/model/selected-flowers';
import { TFlowerCompositionItem } from '../_types';
import { fetchSelectedFlowers, TSelectedFlowerDetail } from '../_api/bouquet-api';

/**
 * API 응답 데이터를 꽃다발 폼 아이템으로 변환
 */
const toFlowerCompositionItem = (
  detail: TSelectedFlowerDetail,
): TFlowerCompositionItem => ({
  id: detail.id,
  name: detail.name_ko,
  keywords: detail.tags,
  imageUrl: detail.imageUrl ?? '',
  colorAndQuantities: detail.colors.map((color) => ({ color, quantity: 1 })),
});

/**
 * 선택한 꽃을 꽃다발 폼에 추가(초기 상태 세팅)
 * - 먼저 selectedFlowersAtom으로 즉시 초기화(id, name)
 * - 이후 API 호출하여 꽃 상세 정보로 업데이트
 */
export const initBouquetFlowersAtom = atom(null, async (get, set) => {
  const selected = get(selectedFlowersAtom);

  // 즉시 초기화 (API 응답 전까지 기본 데이터 표시)
  const bouquetFlowers: TFlowerCompositionItem[] = selected.map((f) => ({
    id: f.id,
    name: f.name,
    keywords: [],
    imageUrl: '',
    colorAndQuantities: [],
  }));
  set(bouquetFlowersAtom, bouquetFlowers);

  // API 호출하여 꽃 상세 정보로 업데이트
  if (selected.length === 0) {return;}

  try {
    const ids = selected.map((f) => Number(f.id));
    const data = await fetchSelectedFlowers(ids);

    const detailMap = new Map(data.map((d) => [d.id, d]));
    const updated = bouquetFlowers.map((f) => {
      const detail = detailMap.get(f.id);
      return detail ? toFlowerCompositionItem(detail) : f;
    });
    set(bouquetFlowersAtom, updated);
  } catch {
    // API 실패 시 기존 초기화 데이터 유지
  }
});

/**
 * 선택한 꽃을 꽃다발 폼에 추가
 * - bouquetFlowersAtom + selectedFlowersAtom 동시 동기화
 * @return true: 추가 성공, false: 이미 추가된 꽃(중복)
 */
export const addBouquetFlowerAtom = atom(
  null,
  (get, set, detail: TSelectedFlowerDetail): boolean => {
    const flowers = get(bouquetFlowersAtom);
    if (flowers.some((f) => f.id === detail.id)) {
      return false;
    }
    set(bouquetFlowersAtom, [
      ...flowers,
      toFlowerCompositionItem(detail),
    ]);
    const selected = get(selectedFlowersAtom);
    if (!selected.some((f) => f.id === detail.id)) {
      set(selectedFlowersAtom, [...selected, { id: detail.id, name: detail.name_ko }]);
    }
    return true;
  },
);

/**
 * 꽃다발 폼에서 꽃을 삭제 (인덱스 기반)
 */
export const removeBouquetFlowerAtom = atom(
  null,
  (get, set, index: number) => {
    const flowers = get(bouquetFlowersAtom);
    set(bouquetFlowersAtom, flowers.filter((_, i) => i !== index));
  },
);

/**
 * 꽃다발 폼에서 꽃을 삭제 (ID 기반)
 * - bouquetFlowersAtom + selectedFlowersAtom 동시 동기화
 */
export const removeBouquetFlowerByIdAtom = atom(
  null,
  (get, set, id: string) => {
    const flowers = get(bouquetFlowersAtom);
    set(bouquetFlowersAtom, flowers.filter((f) => f.id !== id));
    const selected = get(selectedFlowersAtom);
    set(selectedFlowersAtom, selected.filter((f) => f.id !== id));
  },
);

/**
 * 꽃다발 폼에서 꽃의 색상을 추가
 * - 최초 색상 추가 시 기본 수량 1
 */
export const addFlowerColorAtom = atom(
  null,
  (get, set, params: { flowerIndex: number; color: string }) => {
    const flowers = get(bouquetFlowersAtom);
    const updated = flowers.map((f, i) => {
      if (i !== params.flowerIndex) {return f;}
      return {
        ...f,
        colorAndQuantities: [
          ...f.colorAndQuantities,
          { color: params.color, quantity: 1 },
        ],
      };
    });
    set(bouquetFlowersAtom, updated);
  },
);

/**
 * 꽃다발 폼에서 꽃의 색상을 수정
 * - 색상 수정 시 수량은 유지
 * @param flowerIndex 꽃의 인덱스
 * @param colorIndex 색상의 인덱스
 * @param color 색상(hex 코드)
 */
export const updateFlowerColorAtom = atom(
  null,
  (get, set, params: { flowerIndex: number; colorIndex: number; color: string }) => {
    const flowers = get(bouquetFlowersAtom);
    const updated = flowers.map((f, i) => {
      if (i !== params.flowerIndex) {return f;}
      return {
        ...f,
        // 색상 수정 시 수량은 변경 없음
        colorAndQuantities: f.colorAndQuantities.map((cq, ci) =>
          ci === params.colorIndex ? { ...cq, color: params.color } : cq,
        ),
      };
    });
    set(bouquetFlowersAtom, updated);
  },
);

/**
 * 꽃다발 폼에서 꽃의 색상을 삭제
 * - 색상 삭제 시 수량도 함께 삭제
 */
export const removeFlowerColorAtom = atom(
  null,
  (get, set, params: { flowerIndex: number; colorIndex: number }) => {
    const flowers = get(bouquetFlowersAtom);
    const updated = flowers.map((f, i) => {
      if (i !== params.flowerIndex) {return f;}
      return {
        ...f,
        colorAndQuantities: f.colorAndQuantities.filter((_, ci) => ci !== params.colorIndex),
      };
    });
    set(bouquetFlowersAtom, updated);
  },
);

/**
 * 꽃다발 폼에서 꽃의 색상 수량을 증가
 * - 수량 증가 시 수량은 1 이상
 */
export const plusFlowerColorQuantityAtom = atom(
  null,
  (get, set, params: { flowerIndex: number; colorIndex: number }) => {
    const flowers = get(bouquetFlowersAtom);
    const updated = flowers.map((f, i) => {
      // 꽃의 인덱스가 일치하지 않으면 그대로 반환(수정 대상 아님)
      if (i !== params.flowerIndex) {return f;}
      return {
        ...f,
        colorAndQuantities: f.colorAndQuantities.map((cq, ci) =>
          ci === params.colorIndex ? { ...cq, quantity: cq.quantity + 1 } : cq,
        ),
      };
    });
    set(bouquetFlowersAtom, updated);
  },
);

/**
 * 꽃다발 폼에서 꽃의 색상 수량을 감소
 */
export const minusFlowerColorQuantityAtom = atom(
  null,
  (get, set, params: { flowerIndex: number; colorIndex: number }) => {
    const flowers = get(bouquetFlowersAtom);
    const updated = flowers.map((f, i) => {
      // 꽃의 인덱스가 일치하지 않으면 그대로 반환(수정 대상 아님)
      if (i !== params.flowerIndex) {return f;}
      return {
        ...f,
        colorAndQuantities: f.colorAndQuantities.map((cq, ci) =>
          ci === params.colorIndex
            ? { ...cq, quantity: Math.max(1, cq.quantity - 1) }
            : cq,
        ),
      };
    });
    set(bouquetFlowersAtom, updated);
  },
);

/**
 * 꽃다발 폼 초기화
 */
export const resetBouquetFormAtom = atom(null, (_get, set) => {
  set(bouquetNameAtom, '');
  set(bouquetOccasionAtom, '');
  set(bouquetRecipientAtom, '');
  set(bouquetMessageAtom, '');
  set(bouquetFlowersAtom, []);
});
