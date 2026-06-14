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
