/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     tags:
 *       - Auth
 *     summary: 로그아웃 (리다이렉트)
 *     description: |
 *       현재 사용자를 로그아웃하고 지정된 경로로 리다이렉트합니다.
 *       `next`가 없으면 `/login`으로 이동합니다.
 *       브라우저에서 직접 이동하거나 링크를 눌렀을 때 사용하세요.
 *     parameters:
 *       - in: query
 *         name: next
 *         required: false
 *         schema:
 *           type: string
 *         description: 로그아웃 후 리다이렉트할 경로
 *     responses:
 *       302:
 *         description: 로그아웃 후 목적지로 리다이렉트
 *       500:
 *         description: 로그아웃 실패
 *
 *   post:
 *     tags:
 *       - Auth
 *     summary: 로그아웃 (JSON)
 *     description: |
 *       현재 사용자를 로그아웃하고 JSON으로 다음 목적지를 반환합니다.
 *       fetch/AJAX 기반 로그아웃 버튼 등에서 사용하세요.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               next:
 *                 type: string
 *                 example: /login
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 next:
 *                   type: string
 *                   example: /login
 *       500:
 *         description: 로그아웃 실패
 */

import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@shared/supabase/server';

import { resolveNextDestination } from '../helpers';

const DEFAULT_REDIRECT_PATH = '/login';

const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export const GET = async (request: NextRequest) => {
  // 사용자가 브라우저에서 직접 이동할 때 호출되어 로그아웃 후 목적지로 리다이렉트
  try {
    await signOut();
    const next = request.nextUrl.searchParams.get('next');
    const destination = resolveNextDestination(
      request.url,
      next,
      DEFAULT_REDIRECT_PATH,
    );

    return NextResponse.redirect(destination);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : '로그아웃 과정에서 오류가 발생했어요.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  // 클라이언트가 fetch로 호출할 때 사용하며 JSON으로 다음 경로를 반환
  const body = await request.json().catch(() => ({} as { next?: string }));

  try {
    await signOut();

    return NextResponse.json({
      success: true,
      next: body.next ?? DEFAULT_REDIRECT_PATH,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : '로그아웃 과정에서 오류가 발생했어요.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
