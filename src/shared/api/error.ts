import type { AxiosError } from 'axios';

export function isUnauthorizedError(error: unknown) {
  const e = error as (AxiosError | undefined);

  return e?.response?.status === 401;
}
