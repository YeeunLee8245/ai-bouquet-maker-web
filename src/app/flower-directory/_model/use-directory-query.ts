import { useAtomValue } from 'jotai';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import {
  directoryColorsAtom,
  directorySeasonsAtom,
  directorySearchAtom,
  directorySortAtom,
} from './atoms';
import { fetchDirectory } from '@api/flowers.api';

const LIMIT = 20;

export const directoryQueryKey = (params: {
  colors: string[];
  seasons: string[];
  search: string;
  sort: string;
}) => ['flower-directory', params] as const;

export const directoryDefaultQueryParams = {
  colors: [] as string[],
  seasons: [] as string[],
  search: '',
  sort: 'popular' as const,
};

export function useDirectoryQuery() {
  const colors = useAtomValue(directoryColorsAtom);
  const seasons = useAtomValue(directorySeasonsAtom);
  const search = useAtomValue(directorySearchAtom);
  const sort = useAtomValue(directorySortAtom);

  const colorArr = [...colors];
  const seasonArr = [...seasons];

  return useSuspenseInfiniteQuery({
    queryKey: directoryQueryKey({ colors: colorArr, seasons: seasonArr, search, sort }),
    queryFn: ({ pageParam }) => fetchDirectory({
      colors: colorArr,
      seasons: seasonArr,
      search: search || undefined,
      sort,
      page: pageParam,
      limit: LIMIT,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.has_next_page ? lastPage.page + 1 : undefined,
    staleTime: Infinity,
  });
}
