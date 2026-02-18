import { atom } from 'jotai';
import { TSelectedFlower } from './selected-flowers.types';

export const selectedFlowersAtom = atom<TSelectedFlower[]>([]);
