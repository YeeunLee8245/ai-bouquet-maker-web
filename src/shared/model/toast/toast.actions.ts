import { atom } from 'jotai';
import { toastListAtom } from './toast.atoms';
import { TToastItem } from './toast.types';

let toastCounter = 0;

export const showToastAtom = atom(
  null,
  (get, set, params: Omit<TToastItem, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    const toast: TToastItem = { id, ...params };
    set(toastListAtom, [...get(toastListAtom), toast]);
    return id;
  },
);

export const removeToastAtom = atom(
  null,
  (get, set, id: string) => {
    set(toastListAtom, get(toastListAtom).filter((t) => t.id !== id));
  },
);
