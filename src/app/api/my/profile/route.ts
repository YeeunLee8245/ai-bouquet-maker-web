import { NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/my/profile:
 *   get:
 *     tags:
 *       - My
 *     summary: 내 프로필 조회
 *     description: 현재 로그인한 사용자의 프로필 정보 및 활동 통계를 조회합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 오류
 *   patch:
 *     tags:
 *       - My
 *     summary: 내 프로필 수정
 *     description: 닉네임, 소개 등의 프로필 정보를 수정합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *       401:
 *         description: 인증 필요
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

    // 1. 좋아하는 꽃 가져오기
    const { data: favoriteFlowers } = await supabase
      .from('user_flower_likes')
      .select(`
        flower_id,
        flowers (
          name_ko
        )
      `)
      .eq('user_id', publicUser.id)
      .limit(5);

    // 2. 최근 꽃다발 하나 가져오기
    const { data: recentBouquets } = await supabase
      .from('bouquet_recipes')
      .select('name, recipe')
      .eq('user_id', publicUser.id)
      .order('created_at', { ascending: false })
      .limit(1);

    // 3. 추천 통계 (총 추천 횟수)
    const { count: recommendationCount } = await supabase
      .from('recommendations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', publicUser.id);

    return NextResponse.json({
      profile: {
        id: publicUser.id,
        nickname: publicUser.nickname,
        email: publicUser.email,
        bio: publicUser.bio || '',
        created_at: publicUser.created_at,
        avatar_url: publicUser.avatar_url,
      },
      stats: {
        favorite_flowers: (favoriteFlowers as unknown as { flowers: { name_ko: string } | null }[] | null)?.map((f) => f.flowers?.name_ko).filter(Boolean) || [],
        recent_bouquet: recentBouquets?.[0] || null,
        recommendation_count: recommendationCount || 0,
      },
    });
  } catch (error) {
    console.error('[Profile] GET Error:', error);
    return NextResponse.json(
      { error: '프로필 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const publicUser = await getPublicUser();

    if (!publicUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { nickname, bio } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .update({
        nickname: nickname !== undefined ? nickname : publicUser.nickname,
        bio: bio !== undefined ? bio : publicUser.bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', publicUser.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      profile: data,
    });
  } catch (error) {
    console.error('[Profile] PATCH Error:', error);
    return NextResponse.json(
      { error: '프로필 수정 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
