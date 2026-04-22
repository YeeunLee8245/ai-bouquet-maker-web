/**
 * @swagger
 * /api/auth/callback:
 *   get:
 *     tags:
 *       - Auth
 *     summary: OAuth 콜백 처리
 *     description: |
 *       OAuth 인증 완료 후 호출되는 엔드포인트입니다.
 *       사용자 세션을 교환하고, 온보딩 여부를 판단하여 메인 또는 지정된 페이지로 리다이렉트합니다.
 *
 *       **리다이렉트 파라미터:**
 *       - **최초 가입 시:** `?is_new_user=true` 파라미터가 포함됩니다.
 *       - **기존 유저일 때:** `is_new_user` 파라미터가 생략됩니다. (`=false`로 표시되지 않음)
 *     responses:
 *       302:
 *         description: 서비스의 목적지 페이지로 리다이렉트
 *       400:
 *         description: 인증 실패 또는 잘못된 코드
 */

import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@shared/supabase/server';
import { createAdminClient } from '@shared/supabase/admin';
import { checkAndGrantDailyBonus } from '@/lib/users/attendance';

import { resolveNextDestination, detectMobile } from '../helpers';

const LOGIN_PATH = '/login';
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function findPublicUserIdByAuthId(authUserId: string) {
  const supabaseAdmin = createAdminClient();

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('auth_id', authUserId)
      .maybeSingle();

    if (data?.id) {
      if (attempt > 1) {
        console.warn(
          `[AuthCallback] Public user became available after retry ${attempt} for auth user ${authUserId}`,
        );
      }
      return data.id;
    }

    if (error) {
      console.error(
        `[AuthCallback] Failed to fetch public user on attempt ${attempt}:`,
        error,
      );
    }

    await wait(250 * attempt);
  }

  return null;
}

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
      error?.message ?? 'Authentication failed',
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

  // 4️⃣ 일일 로그인 보상 지급 (getPublicUser 내부에서 처리됨)
  // 서버리스 환경의 안정성을 위해 await를 호출합니다.
  try {
    const publicUserId = await findPublicUserIdByAuthId(authUser.id);

    if (!publicUserId) {
      console.error(
        `[AuthCallback] Public user was not ready for daily bonus. authUserId=${authUser.id}`,
      );
    } else {
      await checkAndGrantDailyBonus(publicUserId);
    }
  } catch (err) {
    console.error('[AuthCallback] Failed to trigger daily bonus:', err);
  }

  // 5️⃣ 최종 redirect URL 생성
  const destination = resolveNextDestination(request.url, next, '/');
  const redirectUrl = new URL(destination);

  if (isNewUser) {
    redirectUrl.searchParams.set('is_new_user', 'true');
  }

  // 6️⃣ 모바일 Chrome의 Desktop mode 자동 활성화 방지
  // Sec-CH-UA-Platform으로 실제 OS를 감지 (Desktop mode로 UA가 위장되어도 신뢰 가능)
  // [!] 첫 번째 앱 도메인 응답이 bare 302이면 일부 Android Chrome이 Desktop mode를 활성화

  // [DEBUG] Client Hints 검증용 — 확인 후 제거
  console.warn('[AuthCallback:hints]', JSON.stringify({
    ua: request.headers.get('user-agent'),
    platform: request.headers.get('sec-ch-ua-platform'),
    mobile: request.headers.get('sec-ch-ua-mobile'),
    chUa: request.headers.get('sec-ch-ua'),
    detected: detectMobile(request),
  }));

  if (detectMobile(request)) {
    const target = redirectUrl.toString();
    return new Response(
      `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"><meta http-equiv="refresh" content="0;url=${target}"></head><body><script>location.replace(${JSON.stringify(target)})</script></body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  return NextResponse.redirect(redirectUrl);
}
