import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/recipe/bouquet/{id}/share:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: 꽃다발 레시피 ID (UUID)
 *       schema:
 *         type: string
 *         format: uuid
 *   post:
 *     tags:
 *       - Recipe
 *     summary: 꽃다발 레시피 공개 상태 활성화
 *     description: 꽃다발을 공유할 수 있도록 is_public 컬럼을 true로 설정합니다. 본인의 레시피만 공개 전환할 수 있습니다.
 *     responses:
 *       200:
 *         description: 공개 전환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (타인의 레시피 공개 전환 시도)
 *       404:
 *         description: 레시피를 찾을 수 없음
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const supabase = await createClient();

    // 본인 확인 및 업데이트 진행
    const { data, error } = await supabase
      .from('bouquet_recipes')
      .update({
        is_public: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', publicUser.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to share bouquet recipe:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '레시피를 찾을 수 없거나 공유 설정 권한이 없습니다.' },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { error: '공유 설정에 실패했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sharing bouquet recipe:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
