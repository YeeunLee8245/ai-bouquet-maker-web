import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/flowers/{id}/like:
 *   post:
 *     tags:
 *       - Flowers
 *     summary: 꽃 좋아요 추가
 *     description: 로그인한 사용자가 특정 꽃에 좋아요를 추가합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 꽃 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 좋아요 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isLiked:
 *                   type: boolean
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 꽃을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const flowerId = parseInt(id, 10);

    if (isNaN(flowerId)) {
      return NextResponse.json(
        { error: '유효하지 않은 꽃 ID입니다.' },
        { status: 400 },
      );
    }

    // 인증 및 사용자 정보 확인
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 },
      );
    }

    const supabase = await createClient();

    // 꽃 존재 여부 확인
    const { data: flower, error: flowerError } = await supabase
      .from('flowers')
      .select('id')
      .eq('id', flowerId)
      .single();

    if (flowerError || !flower) {
      return NextResponse.json(
        { error: '꽃을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 좋아요 추가 (upsert로 중복 방지)
    const { error: likeError } = await supabase
      .from('user_flower_likes')
      .upsert({
        user_id: publicUser.id,
        flower_id: flowerId,
      }, {
        onConflict: 'user_id,flower_id',
      });

    if (likeError) {
      console.error('Like insert error:', likeError);
      return NextResponse.json(
        { error: '좋아요 추가 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      isLiked: true,
    });
  } catch (error) {
    console.error('Like API error:', error);
    return NextResponse.json(
      { error: '좋아요 추가 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/flowers/{id}/like:
 *   delete:
 *     tags:
 *       - Flowers
 *     summary: 꽃 좋아요 삭제
 *     description: 로그인한 사용자가 특정 꽃의 좋아요를 삭제합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 꽃 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 좋아요 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isLiked:
 *                   type: boolean
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 오류
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const flowerId = parseInt(id, 10);

    if (isNaN(flowerId)) {
      return NextResponse.json(
        { error: '유효하지 않은 꽃 ID입니다.' },
        { status: 400 },
      );
    }

    // 인증 및 사용자 정보 확인
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 },
      );
    }

    const supabase = await createClient();

    // 좋아요 삭제
    const { error: deleteError } = await supabase
      .from('user_flower_likes')
      .delete()
      .eq('user_id', publicUser.id)
      .eq('flower_id', flowerId);

    if (deleteError) {
      console.error('Like delete error:', deleteError);
      return NextResponse.json(
        { error: '좋아요 삭제 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      isLiked: false,
    });
  } catch (error) {
    console.error('Unlike API error:', error);
    return NextResponse.json(
      { error: '좋아요 삭제 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
