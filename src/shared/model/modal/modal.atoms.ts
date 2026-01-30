import { atom } from 'jotai';
import { TModalDescriptor } from './modal.types';

export const modalStackAtom = atom<TModalDescriptor[]>([]);
