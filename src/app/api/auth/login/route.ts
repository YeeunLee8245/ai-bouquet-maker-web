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
 *         description: OAuth 제공자로 리다이렉트 (성공 시 callback에서 온보딩 여부에 따라 최초 가입 시에만 ?is_new_user=true 파라미터를 포함하여 리다이렉트되며, 기존 유저일 경우 해당 파라미터는 생략됨)
 *       400:
 *         description: 잘못된 요청
 */

import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@shared/supabase/server';

import { buildCallbackUrl, resolveProvider, detectMobile } from '../helpers';

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

    // 모바일 Chrome의 Desktop mode 자동 활성화 방지
    // [!] 첫 번째 앱 도메인 응답이 bare 302이면 일부 Android Chrome이 Desktop mode를 활성화
    if (detectMobile(request)) {
      const target = data.url;
      return new Response(
        `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></head><body><script>location.replace(${JSON.stringify(target)})</script></body></html>`,
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
      );
    }

    return NextResponse.redirect(data.url, { status: 302 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '로그인 요청을 처리할 수 없어요.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
