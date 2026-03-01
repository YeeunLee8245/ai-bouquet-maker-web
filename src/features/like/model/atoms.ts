import { atom, createStore } from 'jotai';
import { LikeKey, LikeState, LikeType } from './types';

type Store = ReturnType<typeof createStore>;

/**
 * LikeState 캐시 맵
 * key: 콘텐츠 ID
 * value: LikeState atom
 */
const cache = new Map<LikeKey, ReturnType<typeof atom<LikeState>>>();

export function makeLikeKey(type: LikeType, id: string): LikeKey {
  return `${type}:${id}`;
}

export function getLikeAtom(key: LikeKey, initialLiked?: boolean) {
  const found = cache.get(key);
  if (found) {return found;}

  const created = atom<LikeState>({
    liked: initialLiked ?? false,
    pending: false,
  });
  cache.set(key, created);
  return created;
}

/**
 * 서버(e.g. API 응답)에서 받은 좋아요 상태를 초기화합니다.
 * @param {Store} store - Jotai store
 * @param {boolean} liked - 좋아요 여부
 * @param {string} id - 콘텐츠 ID
 * @param {LikeType} type - 콘텐츠 타입
 * @returns {void}
 */
export function initLikeFromServer({store, liked, id, type = 'flower'}: {store: Store; liked: boolean; id: string; type: LikeType}) {
  // 로컬 캐시의 좋아요 상태
  const likeAtom = getLikeAtom(makeLikeKey(type, id));
  const current = store.get(likeAtom);

  const {liked: currentLiked, pending: currentPending} = current;

  if (currentPending) {return;}
  // 로컬 캐시와 서버에서 받은 좋아요 상태가 다르면 로컬 캐시 업데이트
  if (currentLiked !== liked) {store.set(likeAtom, {liked, pending: false});}
}
