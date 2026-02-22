import { http } from '@/shared/api';
import { DIRECTORY_COLOR_NAME_MAP } from '../_datas';
import type { TDirectoryResponse } from '../_types';

type DirectoryParams = {
  colors?: string[];
  seasons?: string[];
  search?: string;
  sort?: 'name' | 'popular';
  page?: number;
  limit?: number;
};

export async function fetchDirectory(params: DirectoryParams): Promise<TDirectoryResponse['data']> {
  const searchParams = new URLSearchParams();

  if (params.seasons?.length) {
    searchParams.set('seasons', params.seasons.join(','));
  }

  if (params.colors?.length) {
    const colorNames = params.colors
      .map(id => DIRECTORY_COLOR_NAME_MAP[id as keyof typeof DIRECTORY_COLOR_NAME_MAP]?.[0])
      .filter(Boolean);
    if (colorNames.length) {
      searchParams.set('colors', colorNames.join(','));
    }
  }

  if (params.search) {
    searchParams.set('search', params.search);
  }

  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  if (params.page) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const { data } = await http.get<TDirectoryResponse>(
    `/api/flowers/dictionary?${searchParams}`,
  );
  return data.data;
}
