import type { Provider } from '@supabase/supabase-js';

const OAUTH_PROVIDERS = {
  google: { provider: 'google' as Provider, enabled: true },
  // Kakao credentials can be enabled by flipping the flag below once ready.
  kakao: { provider: 'kakao' as Provider, enabled: false },
} as const;

type ProviderName = keyof typeof OAUTH_PROVIDERS;

const DEFAULT_PROVIDER: ProviderName = 'google';

const providerMap = new Map(
  Object.entries(OAUTH_PROVIDERS).filter(([, meta]) => meta.enabled),
) as Map<ProviderName, (typeof OAUTH_PROVIDERS)[ProviderName]>;

export const resolveProvider = (value?: string | null): Provider => {
  const name = (value ?? DEFAULT_PROVIDER).toLowerCase() as ProviderName;
  const config = providerMap.get(name);

  if (!config) {
    throw new Error('지원하지 않는 로그인 공급자입니다.');
  }

  return config.provider;
};

export const buildCallbackUrl = (requestUrl: string, next?: string | null) => {
  const url = new URL(requestUrl);

  url.pathname = '/api/auth/callback';
  url.search = '';
  url.hash = '';

  if (next && next.startsWith('/')) {
    url.searchParams.set('next', next);
  }

  return url.toString();
};

export const resolveNextDestination = (
  requestUrl: string,
  next: string | null,
  fallbackPath = '/',
) => {
  const url = new URL(requestUrl);
  const finalPath = next && next.startsWith('/') ? next : fallbackPath;

  url.pathname = finalPath;
  url.search = '';
  url.hash = '';

  return url;
};
