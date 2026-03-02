import { NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/my/liked-flowers:
 *   get:
 *     tags:
 *       - My
 *     summary: 내가 좋아요한 꽃 목록 조회
 *     description: |
 *       현재 로그인한 사용자가 좋아요를 누른 꽃 목록을 반환합니다.
 *       좋아요한 최신 순으로 정렬됩니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flowers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       flower_id:
 *                         type: integer
 *                         description: 꽃 고유 ID
 *                         example: 42
 *                       name_ko:
 *                         type: string
 *                         description: 꽃 한국어 이름
 *                         example: "장미"
 *                 total_count:
 *                   type: integer
 *                   description: 좋아요한 꽃 총 개수
 *                   example: 3
 *             examples:
 *               liked_flowers_success:
 *                 summary: "좋아요한 꽃 목록 조회 성공"
 *                 value:
 *                   flowers:
 *                     - flower_id: 42
 *                       name_ko: "장미"
 *                     - flower_id: 17
 *                       name_ko: "튤립"
 *                     - flower_id: 8
 *                       name_ko: "카네이션"
 *                   total_count: 3
 *       401:
 *         description: 인증 필요 (로그인 상태 아님)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "로그인이 필요합니다." }
 *       500:
 *         description: 서버 오류
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
      .from('user_flower_likes')
      .select(`
        flower_id,
        flowers (
          name_ko
        )
      `)
      .eq('user_id', publicUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[LikedFlowers] Query error:', error);
      return NextResponse.json(
        { error: '좋아요한 꽃 목록을 가져오는 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }

    type LikeRow = {
      flower_id: number;
      flowers: { name_ko: string } | null;
    };

    const flowers = (data as unknown as LikeRow[])
      .filter((row) => row.flowers !== null)
      .map((row) => ({
        flower_id: row.flower_id,
        name_ko: row.flowers!.name_ko,
      }));

    return NextResponse.json({
      flowers,
      total_count: flowers.length,
    });
  } catch (error) {
    console.error('[LikedFlowers] GET Error:', error);
    return NextResponse.json(
      { error: '좋아요한 꽃 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
