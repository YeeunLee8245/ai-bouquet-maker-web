/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: OAuth로 로그인
 *     description: 인증을 위해 OAuth 제공자로 리다이렉트합니다
 *     responses:
 *       302:
 *         description: OAuth 제공자로 리다이렉트
 */

import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@shared/supabase/server';

import { buildCallbackUrl, resolveProvider } from '../helpers';

type SignInBody = {
  provider?: string;
  next?: string;
};

const readBody = async (request: NextRequest) => {
  try {
    return (await request.json()) as SignInBody;
  } catch {
    return {};
  }
};

export async function POST(request: NextRequest) {
  const body = await readBody(request);

  try {
    const provider = resolveProvider(
      body.provider ?? request.nextUrl.searchParams.get('provider'),
    );
    const next = body.next ?? request.nextUrl.searchParams.get('next');
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: buildCallbackUrl(request.url, next),
      },
    });

    if (error || !data?.url) {
      throw new Error(error?.message ?? '로그인을 시작할 수 없어요.');
    }

    return NextResponse.json({ provider, url: data.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '로그인 요청을 처리할 수 없어요.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
