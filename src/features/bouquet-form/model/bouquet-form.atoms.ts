import { atom } from 'jotai';
import type { TFlowerCompositionItem, TBouquetLayoutItem } from './bouquet-form.types';

export const bouquetNameAtom = atom<string>('');
export const bouquetOccasionAtom = atom<string>('');
export const bouquetRecipientAtom = atom<string>('');
export const bouquetMessageAtom = atom<string>('');
export const bouquetFlowersAtom = atom<TFlowerCompositionItem[]>([]);
export const bouquetPackagingColorAtom = atom<string>('');
export const bouquetRibbonColorAtom = atom<string>('');
export const bouquetLayoutAtom = atom<TBouquetLayoutItem[] | null>(null);
