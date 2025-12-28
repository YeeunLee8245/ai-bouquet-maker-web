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

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirectToLogin(request, error.message);
    }
  }

  const destination = resolveNextDestination(request.url, next, '/');

  return NextResponse.redirect(destination);
}
