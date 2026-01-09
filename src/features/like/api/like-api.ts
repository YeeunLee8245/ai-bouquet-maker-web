import { fetcher } from '@/shared/lib/axios';

export const postLike = async (id: string) => {
  const response = fetcher.post(`/api/${id}/like`);
};
