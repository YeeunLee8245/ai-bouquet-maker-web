import { NextResponse } from 'next/server';
import { getPublicUser } from '@/lib/users/auth';
import { getUserBalance } from '@/lib/users/wallet';

/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: 현재 토큰 잔액 조회
 *     description: 로그인한 사용자의 현재 보유 토큰량을 조회합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WalletBalance'
 *       401:
 *         description: 인증 필요
 */
export async function GET() {
  try {
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const balance = await getUserBalance(publicUser.id);

    return NextResponse.json({ balance });
  } catch (error) {
    console.error('[Wallet Balance] GET Error:', error);
    return NextResponse.json(
      { error: '잔액 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
