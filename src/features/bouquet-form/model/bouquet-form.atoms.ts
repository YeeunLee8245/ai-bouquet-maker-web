import { atom } from 'jotai';
import type { TFlowerCompositionItem } from './bouquet-form.types';

export const bouquetNameAtom = atom<string>('');
export const bouquetOccasionAtom = atom<string>('');
export const bouquetRecipientAtom = atom<string>('');
export const bouquetMessageAtom = atom<string>('');
export const bouquetFlowersAtom = atom<TFlowerCompositionItem[]>([]);
export const bouquetPackagingColorAtom = atom<string>('');
export const bouquetRibbonColorAtom = atom<string>('');
