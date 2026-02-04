import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/recommend/user-selection:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: 추천 결과 중 선택한 꽃 저장
 *     description: |
 *       추천받은 꽃 목록 중에서 사용자가 실제로 꽃다발에 담기로 선택한 꽃말(flower_meanings) ID들을 기록합니다.
 *       이 데이터는 이후 꽃다발 에디터 단계에서 재조회하여 초기 구성을 만드는데 사용됩니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **호출 시점**: 추천 결과 화면에서 '이 꽃들로 만들기' 버튼을 눌러 에디터로 넘어가기 직전에 호출하세요.
 *       - **데이터 구조**: 중복된 ID는 서버에서 자동으로 제거됩니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recommendation_id, selected_flower_meaning_ids]
 *             properties:
 *               recommendation_id:
 *                 type: string
 *                 format: uuid
 *                 description: "업데이트할 추천 기록의 ID"
 *                 example: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *               selected_flower_meaning_ids:
 *                 type: array
 *                 items: { type: integer }
 *                 description: "선택한 꽃말 고유 ID 목록"
 *                 example: [74, 24, 43]
 *     responses:
 *       200:
 *         description: 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *       400:
 *         description: 필수 파라미터 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string }
 *             examples:
 *               missing_id:
 *                 summary: "추천 ID 누락"
 *                 value: { error: "recommendation_id가 필요합니다." }
 *               missing_flowers:
 *                 summary: "선택된 꽃 정보 누락"
 *                 value: { error: "선택된 꽃 정보(selected_flower_meaning_ids)가 필요합니다." }
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "로그인이 필요한 서비스입니다." }
 *       500:
 *         description: 서버 오류 (DB 업데이트 실패 등)
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
