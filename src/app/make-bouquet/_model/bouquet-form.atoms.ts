import { atom } from 'jotai';
import { TBouquetFlowerItem } from '../_types';

export const bouquetNameAtom = atom<string>('');
export const bouquetOccasionAtom = atom<string>('');
export const bouquetRecipientAtom = atom<string>('');
export const bouquetMessageAtom = atom<string>('');
export const bouquetFlowersAtom = atom<TBouquetFlowerItem[]>([]);
