import { atom } from 'jotai';
import { TFlowerCompositionItem } from '../_types';
import { MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS } from '../_datas';

export const bouquetNameAtom = atom<string>('');
export const bouquetOccasionAtom = atom<string>('');
export const bouquetRecipientAtom = atom<string>('');
export const bouquetMessageAtom = atom<string>('');
export const bouquetFlowersAtom = atom<TFlowerCompositionItem[]>([]);
export const bouquetPackagingColorAtom = atom<string>(MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS[0]);
export const bouquetRibbonColorAtom = atom<string>(MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS[0]);
