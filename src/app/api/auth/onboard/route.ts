import { NextResponse } from 'next/server';
import { getPublicUser, setOnboarded } from '@/lib/users/auth';

/**
 * @swagger
 * /api/onboard:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 온보딩 완료 처리
 *     description: 현재 로그인한 사용자의 온보딩 상태를 완료(is_onboarded = true)로 변경합니다.
 *     responses:
 *       200:
 *         description: 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 오류
 */
export async function POST() {
  try {
    const publicUser = await getPublicUser();
    
    if (!publicUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    await setOnboarded(publicUser.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Onboard] POST Error:', error);
    return NextResponse.json(
      { error: '온보딩 상태 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
