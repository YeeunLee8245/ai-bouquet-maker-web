import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@shared/supabase/server';

import { resolveNextDestination } from '../helpers';

const LOGIN_PATH = '/login';

const redirectToLogin = (request: NextRequest, message: string) => {
  const urlString = resolveNextDestination(request.url, LOGIN_PATH, LOGIN_PATH);
  const url = new URL(urlString);
  url.searchParams.set('error', message);

  return NextResponse.redirect(url);
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const code = request.nextUrl.searchParams.get('code');
  const next = request.nextUrl.searchParams.get('next');
  const providerError =
    request.nextUrl.searchParams.get('error_description') ??
    request.nextUrl.searchParams.get('error');

  // 1️⃣ 소셜 로그인 단계에서 에러 발생
  if (providerError) {
    return redirectToLogin(request, providerError);
  }

  // code 없으면 그냥 next로 이동
  if (!code) {
    const destination = resolveNextDestination(request.url, next, '/');
    return NextResponse.redirect(new URL(destination));
  }

  // 2️⃣ OAuth code → session 교환
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    return redirectToLogin(
      request,
      error?.message ?? 'Authentication failed'
    );
  }

  const authUser = data.user;

  // 3️⃣ 우리 서비스 기준 유저 정보 조회 (최초가입 판단)
  let isNewUser = false;

  try {
    const { data: publicUser, error: publicUserError } = await supabase
      .from('users')
      .select('id, is_onboarded')
      .eq('auth_id', authUser.id)
      .single();

    if (!publicUserError && publicUser) {
      // is_onboarded === false → 최초가입(온보딩 필요)
      if (publicUser.is_onboarded === false) {
        isNewUser = true;
      }
    } else {
      // 이 경우는 거의 없지만 (트리거 실패 등)
      // 안전하게 최초가입으로 처리
      isNewUser = true;
    }
  } catch (err) {
    console.error('[AuthCallback] Failed to fetch public user:', err);
    // 장애 시에도 UX 깨지지 않게 기존 유저 취급
  }

  // 4️⃣ 일일 로그인 보상 지급 (비동기 / UX 영향 없음)
  (async () => {
    try {
      const { getPublicUser } = await import('@/lib/users/auth');
      await getPublicUser();
    } catch (err) {
      console.error(
        '[AuthCallback] Failed to trigger daily bonus via getPublicUser:',
        err
      );
    }
  })();

  // 5️⃣ 최종 redirect URL 생성
  const destination = resolveNextDestination(request.url, next, '/');
  const redirectUrl = new URL(destination);

  if (isNewUser) {
    redirectUrl.searchParams.set('is_new_user', 'true');
  }

  return NextResponse.redirect(redirectUrl);
}
