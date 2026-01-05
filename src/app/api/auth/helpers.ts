import type { Provider } from '@supabase/supabase-js';

const OAUTH_PROVIDERS = {
  google: { provider: 'google' as Provider, enabled: true },
  kakao: { provider: 'kakao' as Provider, enabled: false }, // 구현안됨
} as const;

type ProviderName = keyof typeof OAUTH_PROVIDERS;
const DEFAULT_PROVIDER: ProviderName = 'google';

const enabledProviders = Object.entries(OAUTH_PROVIDERS).filter(
  ([, meta]) => meta.enabled,
) as Array<[ProviderName, (typeof OAUTH_PROVIDERS)[ProviderName]]>;

const providerMap = new Map<ProviderName, (typeof OAUTH_PROVIDERS)[ProviderName]>(
  enabledProviders,
);

/**
 * 강한 next path 검증 (오픈 리다이렉트/이상 경로 방지)
 */
const isSafeNextPath = (next: string) => {
  if (!next.startsWith('/')) {return false;}
  if (next.startsWith('//')) {return false;} // protocol-relative 방지
  if (next.includes('\\')) {return false;}   // windows-style/backslash 방지
  if (/\s/.test(next)) {return false;}       // 공백/개행 방지
  return true;
};

export const resolveProvider = (value?: string | null): Provider => {
  const raw = value ?? DEFAULT_PROVIDER;
  const name = raw.toLowerCase() as ProviderName;

  const config = providerMap.get(name);
  if (!config) {
    // enabled=false이거나 아예 없는 provider 모두 여기로 옴
    throw new Error('지원하지 않는 로그인 공급자입니다.');
  }

  return config.provider;
};

const getBaseOrigin = (requestUrl: string) => {
  try {
    const url = new URL(requestUrl);
    // 요청 URL이 절대 경로(http/https 포함)인 경우 해당 origin을 우선 사용
    if (url.origin && url.origin !== 'null') {
      return url.origin;
    }
  } catch (e) {
    // 상대 경로인 경우 catch로 넘어감
  }

  // Fallback: 환경변수 사용
  const envBase = process.env.NEXT_PUBLIC_SITE_URL;
  if (envBase) {
    try {
      return new URL(envBase).origin;
    } catch {
      return envBase;
    }
  }

  return '';
};

export const buildCallbackUrl = (requestUrl: string, next?: string | null) => {
  const origin = getBaseOrigin(requestUrl);
  const url = new URL('/api/auth/callback', origin);

  if (next && isSafeNextPath(next)) {
    url.searchParams.set('next', next);
  }

  return url.toString();
};

export const resolveNextDestination = (
  requestUrl: string,
  next: string | null,
  fallbackPath = '/',
) => {
  const origin = getBaseOrigin(requestUrl);
  const safeFallback = isSafeNextPath(fallbackPath) ? fallbackPath : '/';

  const finalPath = next && isSafeNextPath(next) ? next : safeFallback;

  // redirect 목적이면 path만 있으면 충분해서 origin+path string으로 통일
  return new URL(finalPath, origin).toString();
};
