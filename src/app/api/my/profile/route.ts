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
 *     description: |
 *       현재 로그인한 사용자의 프로필 정보와 활동 통계(좋아요 한 꽃, 최근 꽃다발 등)를 조회합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/User'
 *                 stats:
 *                   type: object
 *                   properties:
 *                     favorite_flowers:
 *                       type: array
 *                       items: { type: string }
 *                       description: "최근 좋아요를 누른 꽃 이름 목록 (최대 5개)"
 *                       example: ["장미", "튤립"]
 *                     recent_bouquet:
 *                       type: object
 *                       nullable: true
 *                       description: "가장 최근에 생성한 꽃다발 요약"
 *                     recommendation_count:
 *                       type: integer
 *                       description: "지금까지 받은 총 추천 횟수"
 *                       example: 12
 *             examples:
 *               profile_success:
 *                 summary: "프로필 및 통계 조회 성공"
 *                 value:
 *                   profile:
 *                     id: "user-uuid"
 *                     email: "user@example.com"
 *                     nickname: "꽃돌이"
 *                     bio: "꽃을 사랑하는 사람입니다."
 *                     avatar_url: "https://.../avatar.png"
 *                     is_onboarded: true
 *                   stats:
 *                     favorite_flowers: ["장미", "카네이션"]
 *                     recent_bouquet: { name: "어버이날 꽃다발" }
 *                     recommendation_count: 5
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
 *   patch:
 *     tags:
 *       - My
 *     summary: 내 프로필 수정
 *     description: |
 *       사용자의 닉네임과 자기소개(bio)를 수정합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 새로운 닉네임
 *                 example: "수정된닉네임"
 *                 minLength: 2
 *                 maxLength: 20
 *               bio:
 *                 type: string
 *                 description: 새로운 자기소개
 *                 example: "안녕하세요, 반가워요!"
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 profile:
 *                   $ref: '#/components/schemas/User'
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
