import { atom } from 'jotai';
import {
  bouquetNameAtom,
  bouquetOccasionAtom,
  bouquetRecipientAtom,
  bouquetMessageAtom,
  bouquetFlowersAtom,
} from './bouquet-form.atoms';
import { selectedFlowersAtom } from '@/shared/model/selected-flowers';
import { TBouquetFlowerItem } from '../_types';

/**
 * 선택한 꽃을 꽃다발 폼에 추가(초기 상태 세팅)
 */
export const initBouquetFlowersAtom = atom(null, (get, set) => {
  const selected = get(selectedFlowersAtom);
  const bouquetFlowers: TBouquetFlowerItem[] = selected.map((f) => ({
    flowerId: f.id,
    name: f.name,
    colorAndQuantities: [],
  }));
  set(bouquetFlowersAtom, bouquetFlowers);
});

/**
 * 선택한 꽃을 꽃다발 폼에 추가
 * @returnn
 * true: 추가 성공
 * false: 이미 추가된 꽃(중복 추가는 실패)
 */
export const addBouquetFlowerAtom = atom(
  null,
  (get, set, flower: { flowerId: string; name: string }): boolean => {
    const flowers = get(bouquetFlowersAtom);
    // 이미 추가된 꽃인지 확인
    if (flowers.some((f) => f.flowerId === flower.flowerId)) {
      return false;
    }
    // 꽃다발 폼에 추가
    set(bouquetFlowersAtom, [
      ...flowers,
      { flowerId: flower.flowerId, name: flower.name, colorAndQuantities: [] },
    ]);
    return true;
  },
);

/**
 * 꽃다발 폼에서 꽃을 삭제
 */
export const removeBouquetFlowerAtom = atom(
  null,
  (get, set, index: number) => {
    const flowers = get(bouquetFlowersAtom);
    set(bouquetFlowersAtom, flowers.filter((_, i) => i !== index));
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
