import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

/**
 * Server Component에서 API 호출용 fetch 래퍼.
 * 브라우저 쿠키를 전달하여 인증이 필요한 API 라우트에서도 동작한다.
 */
export async function serverFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
      Cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    throw new Error(`Server fetch error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
