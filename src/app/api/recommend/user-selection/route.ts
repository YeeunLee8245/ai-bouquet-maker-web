import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/recommend/user-selection:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: 선택한 꽃 업데이트
 *     description: 사용자가 선택한 꽃말 ID 목록을 추천 기록에 업데이트합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recommendation_id
 *               - selected_flower_meaning_ids
 *             properties:
 *               recommendation_id:
 *                 type: string
 *                 format: uuid
 *                 example: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *               selected_flower_meaning_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [74, 24, 43]
 *     responses:
 *       200:
 *         description: 업데이트 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest) {
  try {
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recommendation_id, selected_flower_meaning_ids } = body ?? {};

    if (!recommendation_id || typeof recommendation_id !== 'string') {
      return NextResponse.json(
        { error: 'recommendation_id is required' },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(selected_flower_meaning_ids) ||
      selected_flower_meaning_ids.length === 0
    ) {
      return NextResponse.json(
        { error: 'selected_flower_meaning_ids is required' },
        { status: 400 },
      );
    }

    const uniqueIds = [
      ...new Set(
        selected_flower_meaning_ids
          .map((id: number | string) => Number(id))
          .filter((id: number) => Number.isFinite(id)),
      ),
    ];

    if (uniqueIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid flower meaning ids provided' },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    console.debug('uniqueIds', uniqueIds);
    console.debug('recommendation_id', recommendation_id);
    console.debug('publicUser.id', publicUser.id);

    const { error } = await supabase
      .from('recommendations')
      .update({ selected_flower_meanings_ids: uniqueIds })
      .eq('id', recommendation_id)
      .eq('user_id', publicUser.id);

    if (error) {
      console.error('Failed to update recommendation selection:', error);
      return NextResponse.json(
        { error: 'Failed to update selection' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating recommendation selection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
