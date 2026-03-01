import { fetcher } from '@/shared/lib/axios';

type TLikeResponse = {
  isLiked: boolean;
};

export const postLike = async (id: string): Promise<boolean> => {
  const response = await fetcher.post<TLikeResponse>(`/api/flowers/${id}/like`);
  const { isLiked } = response.data ?? {};
  return isLiked;
};

export const deleteLike = async (id: string): Promise<boolean> => {
  const response = await fetcher.delete<TLikeResponse>(`/api/flowers/${id}/like`);
  const { isLiked } = response.data ?? {};
  return isLiked;
};
