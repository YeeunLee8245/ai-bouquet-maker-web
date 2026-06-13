import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { usePathname } from 'next/navigation';
import { LikeType } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getLikeAtom, makeLikeKey } from './atoms';
import { deleteLike, postLike } from '../api/like-api';
import { isUnauthorizedError } from '@/shared/api/error';
import { loginRequiredAtom } from '@/shared/model/login/login-guard.atoms';

export type TUseLikeParams = {
  type: LikeType;
  id: string;
  initialLiked?: boolean;
  queryKeyToPatch?: readonly unknown[];
  patchQueryData?: (prev: unknown, liked: boolean) => unknown;
};

export function useLike({type, id, initialLiked, queryKeyToPatch, patchQueryData}: TUseLikeParams) {
  const store = useStore();
  const queryClient = useQueryClient();
  const setLoginRequired = useSetAtom(loginRequiredAtom);
  const pathname = usePathname();

  const key = makeLikeKey(type, id);
  const atom = getLikeAtom(key, initialLiked);
  const state = useAtomValue(atom);

  const mutation = useMutation({
    mutationFn: async (newLiked: boolean) => {
      if (newLiked) {
        return postLike(id);
      }
      return deleteLike(id);
    },
    // 뮤테이션 시작 직전에 상태 업데이트
    onMutate: (newLiked: boolean) => {
      const prev = store.get(atom);
      store.set(atom, { liked: newLiked, pending: true });

      let prevQueryData = undefined;
      if (queryKeyToPatch && patchQueryData) {
        prevQueryData = queryClient.getQueryData(queryKeyToPatch);
        queryClient.setQueryData(queryKeyToPatch, patchQueryData(prevQueryData, newLiked));
      }

      // {캐시 데이터, 캐시 데이터 패치 함수}
      return { prev, prevQueryData };
    },
    onError: (err, _, onMutateContext) => {
      const {prev, prevQueryData} = onMutateContext ?? {};
      // 캐시 데이터 기반 롤백
      if (prev) { store.set(atom, {...prev, pending: false}); }
      if (prevQueryData && queryKeyToPatch && patchQueryData !== undefined) {
        queryClient.setQueryData(queryKeyToPatch, prevQueryData);
      }

      if (isUnauthorizedError(err)) {
        setLoginRequired({ isRequired: true, nextPath: pathname });
      }
    },
    onSuccess: (data) => {
      store.set(atom, { liked: data, pending: false });

      // 서버 응답 기반 캐시 데이터 업데이트
      if (queryKeyToPatch && patchQueryData) {
        queryClient.setQueryData(queryKeyToPatch, (prev: unknown) => patchQueryData(prev, data));
      }
    },
  });

  const toggle = () => {
    if (state.pending) {return;}
    mutation.mutate(!state.liked);
  };

  return {
    liked: state.liked,
    pending: state.pending,
    toggle,
  };
}
