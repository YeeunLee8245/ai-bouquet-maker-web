import { atom } from 'jotai';
import { LikeState, LikeType } from './types';

/**
 * LikeState 캐시 맵
 * key: 콘텐츠 ID
 * value: LikeState atom
 */
const cache = new Map<LikeType, ReturnType<typeof atom<LikeState>>>();

export function makeLikeKey(type: LikeType, id: string) {
  return `${type}:${id}`;
}

export function getLikeAtom(key: LikeType) {
  const found = cache.get(key);
  if (found) {return found;}

  const created = atom<LikeState>({
    liked: false,
    pending: false,
  });
  cache.set(key, created);
  return created;
}
