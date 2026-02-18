import { atom } from 'jotai';
import { directoryDefaultSelectedColors, directoryDefaultSelectedSeasons } from '../_datas';

export const directoryFilterOpenAtom = atom(false);

export const directoryColorsAtom = atom<Set<string>>(
  new Set(directoryDefaultSelectedColors.map(({ id }) => id)),
);

export const directorySeasonsAtom = atom<Set<string>>(
  new Set(directoryDefaultSelectedSeasons.map(({ id }) => id)),
);

export const directorySearchAtom = atom('');

export const directorySortAtom = atom<'name' | 'popular'>('popular');

export const resetDirectoryFiltersAtom = atom(null, (_get, set) => {
  set(directoryColorsAtom, new Set(directoryDefaultSelectedColors.map(({ id }) => id)));
  set(directorySeasonsAtom, new Set(directoryDefaultSelectedSeasons.map(({ id }) => id)));
});
