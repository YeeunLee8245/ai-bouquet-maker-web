import { atom } from 'jotai';

export type TLoginRequired = {
  isRequired: boolean;
  nextPath?: string;
};

export const loginRequiredAtom = atom<TLoginRequired>({ isRequired: false });
