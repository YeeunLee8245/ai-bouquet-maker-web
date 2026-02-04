import { NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/wallet/history:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: 지갑 거래 내역 조회
 *     description: 로그인한 사용자의 토큰 적립/사용 내역을 최신순으로 조회합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WalletLedger'
 *             examples:
 *               history_success:
 *                 summary: "거래 내역 조회 성공"
 *                 value:
 *                   - id: 101
 *                     source: "daily_login"
 *                     type: "credit"
 *                     amount: 10
 *                     balance_after: 150
 *                     description: "일일 로그인 보너스"
 *                     created_at: "2024-02-04T00:00:00Z"
 *                   - id: 98
 *                     source: "admin"
 *                     type: "debit"
 *                     amount: 1
 *                     balance_after: 140
 *                     reference_type: "recommendation"
 *                     reference_id: "uuid-string"
 *                     description: "AI 대상 맞춤 추천 사용"
 *                     created_at: "2024-02-03T15:30:00Z"
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "로그인이 필요합니다." }
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

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('wallet_ledgers')
      .select('*')
      .eq('public_user_id', publicUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Wallet History] Fetch Error:', error);
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('[Wallet History] GET Error:', error);
    return NextResponse.json(
      { error: '내역 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
