/**
 * @swagger
 * /api/auth/login:
 *   get:
 *     tags:
 *       - Auth
 *     summary: OAuth로 로그인
 *     description: 인증을 위해 OAuth 제공자로 리다이렉트합니다
 *     parameters:
 *       - in: query
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - google
 *             - kakao
 *         description: 'OAuth 제공자 (예: google, kakao)'
 *       - in: query
 *         name: next
 *         required: false
 *         schema:
 *           type: string
 *         description: 로그인 완료 후 리다이렉트할 경로
 *     responses:
 *       302:
 *         description: OAuth 제공자로 리다이렉트 (성공 시 callback에서 온보딩 여부에 따라 ?is_new_user=true 파라미터를 포함하여 리다이렉트됨)
 *       400:
 *         description: 잘못된 요청
 */

import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@shared/supabase/server';

import { buildCallbackUrl, resolveProvider } from '../helpers';

export async function GET(request: NextRequest) {
  try {
    const provider = resolveProvider(
      request.nextUrl.searchParams.get('provider'),
    );
    const next = request.nextUrl.searchParams.get('next');
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

    return NextResponse.redirect(data.url, { status: 302 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '로그인 요청을 처리할 수 없어요.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
