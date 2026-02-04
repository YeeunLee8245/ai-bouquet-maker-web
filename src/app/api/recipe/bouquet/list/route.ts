import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';
import { BouquetRecipeContent } from '@/types/recommendation';

/**
 * @swagger
 * /api/recipe/bouquet/list:
 *   get:
 *     tags:
 *       - Recipe
 *     summary: 꽃다발 레시피 목록 조회
 *     description: |
 *       저장된 꽃다발 레시피 목록을 조회합니다.
 *
 *       **필터 옵션**:
 *       - `my_only=true`: 로그인한 사용자의 꽃다발만 조회 (로그인 필수)
 *       - `my_only=false` 또는 미지정: 빈 배열 반환 (공개 꽃다발 기능 추후 구현 예정)
 *
 *       **정렬**: 최신순 (created_at DESC)
 *     parameters:
 *       - name: my_only
 *         in: query
 *         description: |
 *           내 꽃다발만 필터링 여부
 *           - `true`: 로그인한 사용자의 꽃다발만 조회 (로그인 필수)
 *           - `false` 또는 미지정: 빈 배열 반환 (공개 꽃다발 기능 추후 구현)
 *         schema:
 *           type: boolean
 *           default: false
 *         example: true
 *       - name: page
 *         in: query
 *         description: 페이지 번호 (1부터 시작)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: 페이지당 개수
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   required:
 *                     - bouquets
 *                     - total
 *                     - page
 *                     - limit
 *                     - has_next_page
 *                   properties:
 *                     bouquets:
 *                       type: array
 *                       description: 꽃다발 레시피 목록
 *                       items:
 *                         $ref: '#/components/schemas/BouquetRecipeListItem'
 *                     total:
 *                       type: integer
 *                       description: 전체 결과 개수
 *                     page:
 *                       type: integer
 *                       description: 현재 페이지 번호
 *                     limit:
 *                       type: integer
 *                       description: 페이지당 개수
 *                     has_next_page:
 *                       type: boolean
 *                       description: 다음 페이지 존재 여부
 *             examples:
 *               my_only_true:
 *                 summary: my_only=true (내 꽃다발 조회)
 *                 value:
 *                   success: true
 *                   data:
 *                     bouquets:
 *                       - id: "550e8400-e29b-41d4-a716-446655440000"
 *                         name: "생일 축하 꽃다발"
 *                         occasion: "생일"
 *                         recipient: "어머니"
 *                         message: "항상 건강하세요!"
 *                         flowers:
 *                           - flower_id: 1
 *                             flower_name: "장미"
 *                             quantity: 3
 *                             color: "빨강"
 *                           - flower_id: 2
 *                             flower_name: "튤립"
 *                             quantity: 2
 *                             color: null
 *                         created_at: "2025-12-06T00:00:00Z"
 *                         updated_at: "2025-12-06T00:00:00Z"
 *                     total: 2
 *                     page: 1
 *                     limit: 10
 *                     has_next_page: false
 *               my_only_false:
 *                 summary: my_only=false 또는 미지정 (빈 배열 반환)
 *                 value:
 *                   success: true
 *                   data:
 *                     bouquets: []
 *                     total: 0
 *                     page: 1
 *                     limit: 10
 *                     has_next_page: false
 *       401:
 *         description: 인증 필요 (my_only=true인 경우)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "내 꽃다발 조회는 로그인이 필요합니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "꽃다발 목록 조회 중 오류가 발생했습니다."
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 파라미터 파싱
    const myOnly = searchParams.get('my_only') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

    const supabase = await createClient();
    let publicUserId: string | null = null;

    // 내 꽃다발만 조회하는 경우 로그인 필요
    if (myOnly) {
      const publicUser = await getPublicUser();
      if (!publicUser) {
        return NextResponse.json(
          { error: '내 꽃다발 조회는 로그인이 필요합니다.' },
          { status: 401 },
        );
      }
      publicUserId = publicUser.id;
    } else {
      // 공개 꽃다발 조회 기능은 추후 구현 예정
      // 현재는 빈 배열 반환
      return NextResponse.json({
        success: true,
        data: {
          bouquets: [],
          total: 0,
          page,
          limit,
          has_next_page: false,
        },
      });
    }

    // 쿼리 빌드
    let query = supabase
      .from('bouquet_recipes')
      .select('*', { count: 'exact' })
      .eq('user_id', publicUserId);

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // 정렬: 최신순
    query = query.order('created_at', { ascending: false });

    const { data: bouquets, error, count } = await query;

    if (error) {
      console.error('Bouquet list query error:', error);
      return NextResponse.json(
        { error: '꽃다발 목록 조회 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }

    // 꽃 정보 가져오기 (recipe에서 flower_id 추출)
    const allFlowerIds = new Set<number>();
    (bouquets || []).forEach(bouquet => {
      const recipe = bouquet.recipe as BouquetRecipeContent | null;
      if (recipe?.flowers) {
        recipe.flowers.forEach(f => allFlowerIds.add(f.flower_id));
      }
    });

    // 꽃 이름 조회
    let flowerMap: Record<number, string> = {};
    if (allFlowerIds.size > 0) {
      const { data: flowers } = await supabase
        .from('flowers')
        .select('id, name_ko')
        .in('id', Array.from(allFlowerIds));

      if (flowers) {
        flowerMap = Object.fromEntries(
          flowers.map(f => [f.id, f.name_ko]),
        );
      }
    }

    // 응답 형식으로 변환
    const formattedBouquets = (bouquets || []).map(bouquet => {
      const recipe = bouquet.recipe as BouquetRecipeContent | null;

      // 담은 꽃 정보 추출
      const flowers = (recipe?.flowers || []).map(f => ({
        flower_id: f.flower_id,
        flower_name: flowerMap[f.flower_id] || '알 수 없음',
        quantity: f.quantity,
        color: f.color || null,
      }));

      return {
        id: bouquet.id,
        name: bouquet.name || '이름 없음',
        occasion: bouquet.occasion || null,
        recipient: bouquet.recipient || null,
        message: bouquet.message || null,
        flowers,
        created_at: bouquet.created_at,
        updated_at: bouquet.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        bouquets: formattedBouquets,
        total: count || 0,
        page,
        limit,
        has_next_page: (count || 0) > page * limit,
      },
    });
  } catch (error) {
    console.error('Bouquet list error:', error);
    return NextResponse.json(
      { error: '꽃다발 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
