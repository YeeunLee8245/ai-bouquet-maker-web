import { atom } from 'jotai';
import { modalStackAtom } from './modal.atoms';
import { TModalDescriptor } from './modal.types';

/**
 * 모달 열기
 */
export const openModalAtom = atom(null, (get, set, descriptor: TModalDescriptor) => {
  const stack = get(modalStackAtom);
  set(modalStackAtom, [...stack, descriptor]);
});

/**
 * 마지막 모달(가장 상위 모달) 닫기
 */
export const closeModalAtom = atom(null, (get, set) => {
  const stack = get(modalStackAtom);
  set(modalStackAtom, stack.slice(0, -1));
});

/**
 * 모달 스택 초기화
 */
export const resetModalAtom = atom(null, (get, set) => {
  set(modalStackAtom, []);
});
