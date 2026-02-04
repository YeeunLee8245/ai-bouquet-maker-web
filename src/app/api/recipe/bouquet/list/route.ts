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
 *       현재는 본인이 생성한 레시피만 조회 가능합니다 (`my_only=true`).
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **목록 표시 정보**: 각 레시피의 기본 정보(이름, 날짜)와 함께 포함된 꽃들의 요약 정보(`flowers` 배열)를 제공합니다.
 *       - **상세 이동**: 목록 아이템의 `id`를 사용하여 상세 조회 API(`/api/recipe/bouquet/{id}`)를 호출하세요.
 *
 *       **필터 및 페이징**:
 *       - `my_only`: 항상 `true`여야 현재 데이터를 반환합니다.
 *       - `page`, `limit`: 표준적인 Offset 기반 페이지네이션을 사용합니다.
 *       - `total`: 전체 항목 수를 반환하므로 페이지 UI 구성에 활용하세요.
 *     parameters:
 *       - name: my_only
 *         in: query
 *         description: |
 *           내 꽃다발만 조회할지 여부
 *           - **`true` (필수)**: 로그인한 사용자의 꽃다발 목록을 반환합니다.
 *           - `false` 또는 미지정: 현재는 빈 목록(`[]`)이 반환됩니다 (전체 공개용 목록은 추후 지원 예정).
 *         schema:
 *           type: boolean
 *           default: false
 *         example: true
 *       - name: page
 *         in: query
 *         description: 조회할 페이지 번호 (1부터 시작)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - name: limit
 *         in: query
 *         description: 한 페이지에 표시할 아이템 수 (최대 50)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, data]
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   required: [bouquets, total, page, limit, has_next_page]
 *                   properties:
 *                     bouquets:
 *                       type: array
 *                       description: "검색 조건에 맞는 꽃다발 레시피들"
 *                       items:
 *                         $ref: '#/components/schemas/BouquetRecipeListItem'
 *                     total: { type: integer, description: "전체 아이템 수", example: 12 }
 *                     page: { type: integer, description: "현재 페이지", example: 1 }
 *                     limit: { type: integer, description: "페이지당 개수", example: 10 }
 *                     has_next_page: { type: boolean, description: "다음 페이지 존재 여부", example: true }
 *             examples:
 *               my_only_true:
 *                 summary: 나의 꽃다발 목록 조회 (성공)
 *                 value:
 *                   success: true
 *                   data:
 *                     bouquets:
 *                       - id: "550e8400-e29b-41d4-a716-446655440000"
 *                         name: "어머니 생신 축하 꽃다발"
 *                         occasion: "생일"
 *                         recipient: "어머니"
 *                         flowers:
 *                           - flower_id: 1
 *                             flower_name: "장미"
 *                             quantity: 5
 *                             color: "#FF0000"
 *                           - flower_id: 5
 *                             flower_name: "안개꽃"
 *                             quantity: 3
 *                             color: "#FFFFFF"
 *                         created_at: "2025-12-06T12:00:00Z"
 *                         updated_at: "2025-12-06T15:30:00Z"
 *                     total: 1
 *                     page: 1
 *                     limit: 10
 *                     has_next_page: false
 *       401:
 *         description: 인증 실패 (my_only=true이고 로그아웃 상태인 경우)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "내 꽃다발 조회는 로그인이 필요합니다." }
 *       500:
 *         description: 서버 오류
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
