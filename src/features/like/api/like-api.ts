import { fetcher } from '@/shared/lib/axios';

type TLikeResponse = {
  success: boolean;
  isLiked: boolean;
};

export const postLike = async (id: string): Promise<boolean> => {
  const response = await fetcher.post<TLikeResponse>(`/api/${id}/like`);
  const { success, isLiked } = response.data ?? {};
  return success && isLiked;
};

export const deleteLike = async (id: string): Promise<boolean> => {
  const response = await fetcher.delete<TLikeResponse>(`/api/${id}/like`);
  const { success, isLiked } = response.data ?? {};
  return success && !isLiked;
};
