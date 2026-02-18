import { useAtomValue } from 'jotai';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  directoryColorsAtom,
  directorySeasonsAtom,
  directorySearchAtom,
  directorySortAtom,
} from './atoms';
import { fetchDirectory } from '../_api/directory-api';

const LIMIT = 20;

export const directoryQueryKey = (params: {
  colors: string[];
  seasons: string[];
  search: string;
  sort: string;
}) => ['flower-directory', params] as const;

export function useDirectoryQuery() {
  const colors = useAtomValue(directoryColorsAtom);
  const seasons = useAtomValue(directorySeasonsAtom);
  const search = useAtomValue(directorySearchAtom);
  const sort = useAtomValue(directorySortAtom);

  const colorArr = [...colors];
  const seasonArr = [...seasons];

  return useInfiniteQuery({
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
  });
}
