import { atom } from 'jotai';
import { TToastItem } from './toast.types';

export const toastListAtom = atom<TToastItem[]>([]);
