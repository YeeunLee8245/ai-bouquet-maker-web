import { QueryClient } from '@tanstack/react-query';

/**
 * Server Component에서 prefetch용 QueryClient를 생성한다.
 * 요청마다 새로 생성해야 사용자 간 데이터 누출이 없다.
 * staleTime/gcTime은 설정하지 않음 — 각 쿼리 훅에서 데이터 특성에 맞게 개별 지정.
 */
export function createServerQueryClient() {
  return new QueryClient();
}
