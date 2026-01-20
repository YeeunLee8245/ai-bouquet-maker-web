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

  if (providerError) {
    return redirectToLogin(request, providerError);
  }

  let isNewUser = false;

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirectToLogin(request, error.message);
    }

    // 신규 유저 여부 확인: 가입 시점과 로그인 시점이 같으면 최초 로그인으로 판단
    if (data?.user) {
      const { created_at, last_sign_in_at } = data.user;
      if (!last_sign_in_at || created_at === last_sign_in_at) {
        isNewUser = true;
      }
    }
  }

  const destination = resolveNextDestination(request.url, next, '/');
  const redirectUrl = new URL(destination);

  if (isNewUser) {
    redirectUrl.searchParams.set('is_new_user', 'true');
  }

  return NextResponse.redirect(redirectUrl);
}
