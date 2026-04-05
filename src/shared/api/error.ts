import type { IApiError } from './types';

export function isApiError(error: unknown): error is IApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as IApiError).message === 'string'
  );
}

export function isUnauthorizedError(error: unknown): boolean {
  return isApiError(error) && error.status === 401;
}
