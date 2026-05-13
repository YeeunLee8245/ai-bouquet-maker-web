import { atom } from 'jotai';

export type TLoginRequired = {isRequired: false} | {isRequired: true; nextPath?: string};

export const loginRequiredAtom = atom<TLoginRequired>({ isRequired: false });
