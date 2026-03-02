import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getUser } from '@/lib/users/auth';
import { toSupabaseResizedImageUrl } from '@shared/utils/image-url';

/**
 * 현재 계절 가져오기 (서버 시간 기준)
 */
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) {return 'spring';}
  if (month >= 6 && month <= 8) {return 'summer';}
  if (month >= 9 && month <= 11) {return 'autumn';}
  return 'winter'; // 12, 1, 2월
}

/**
 * @swagger
 * /api/flowers/dictionary:
 *   get:
 *     tags:
 *       - Flowers
 *     summary: 꽃 사전 목록 조회
 *     description: |
 *       필터, 검색, 정렬을 지원하는 꽃 사전 API입니다.
 *       사용자가 꽃을 검색하거나 계절별, 색상별로 탐색할 때 사용합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **`default_season`**: 현재 서버 시간 기준 추천 계절입니다. 초기 진입 시 이 값을 기반으로 필터를 설정할 수 있습니다.
 *       - **`isLiked` 활성화**: 사용자가 로그인 상태일 때만 `true`/`false`가 제공됩니다. 비로그인 시 `isLiked` 키 자체가 응답에 없으므로(`undefined`) 하트 아이콘을 비활성 상태로 그려주세요.
 *       - **이미지 최적화**: `imageUrl`이 없는 경우 프론트엔드 기본 이미지를 사용하도록 구현하는 것이 좋습니다.
 *
 *       **정렬 기준**:
 *       - `name`: 가나다순 (기본값)
 *       - `popular`: 좋아요가 많은 인기순
 *     parameters:
 *       - name: seasons
 *         in: query
 *         description: |
 *           계절 필터 (콤마로 구분된 여러 개 가능)
 *           - 지원 값: `spring`, `summer`, `autumn`, `winter`, `all_year`
 *           - 미지정 시 전체 계절 조회
 *         schema:
 *           type: string
 *           example: spring,summer
 *       - name: colors
 *         in: query
 *         description: |
 *           색상 이름 필터 (콤마로 구분된 여러 개 가능)
 *           - 현재 지원 색상: 노랑, 보라, 분홍, 빨강, 주황, 파랑, 흰색
 *           - 잘못된 색상 입력 시 `400 Bad Request`와 함께 유효한 색상 목록을 반환합니다.
 *         schema:
 *           type: string
 *           example: 빨강,분홍
 *       - name: search
 *         in: query
 *         description: |
 *           꽃 이름 또는 꽃말로 검색 (부분 일치)
 *         schema:
 *           type: string
 *           example: 사랑
 *       - name: sort
 *         in: query
 *         description: 정렬 옵션
 *         schema:
 *           type: string
 *           enum: [popular, name]
 *           default: name
 *       - name: page
 *         in: query
 *         description: 페이지 번호 (1부터 시작)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: 한 페이지에 표시할 아이템 수
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, data]
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   required: [default_season, flowers, total, page, limit, has_next_page]
 *                   properties:
 *                     default_season:
 *                       type: string
 *                       enum: [spring, summer, autumn, winter]
 *                       description: "현재 서버 시간 기준 계절 (추천용)"
 *                       example: spring
 *                     flowers:
 *                       type: array
 *                       description: "꽃 정보 목록 (간략 정보)"
 *                       items:
 *                         type: object
 *                         required: [id, imageUrl, name, colors, tags]
 *                         properties:
 *                           id: { type: string, description: "꽃 ID (상세 조회용)", example: "1" }
 *                           imageUrl: { type: string, description: "대표 이미지 URL", example: "/images/flowers/rose.png" }
 *                           name: { type: string, description: "한글 이름", example: "장미" }
 *                           isLiked: { type: boolean, nullable: true, description: "로그인 유저의 좋아요 여부. 비로그인 시 키 자체가 없음(undefined)", example: true }
 *                           colors: { type: array, items: { type: string }, description: "대표 색상 코드(HEX) 목록", example: ["#FF4D6D"] }
 *                           tags: { type: array, items: { type: string }, description: "상징 꽃말 (최대 3개)", example: ["열정적 사랑", "순결"] }
 *                     total: { type: integer, description: "전체 결과 수", example: 120 }
 *                     page: { type: integer, example: 1 }
 *                     limit: { type: integer, example: 20 }
 *                     has_next_page: { type: boolean, example: true }
 *             examples:
 *               flower_list_success:
 *                 summary: "꽃 목록 조회 성공 (로그인 상태, 봄/분홍 필터)"
 *                 value:
 *                   success: true
 *                   data:
 *                     default_season: "spring"
 *                     flowers:
 *                       - id: "1"
 *                         imageUrl: "/images/flowers/tulip.png"
 *                         name: "튤립"
 *                         isLiked: true
 *                         colors: ["#F8BBD0", "#FF4D6D"]
 *                         tags: ["사랑의 고백", "영원한 애정"]
 *                       - id: "5"
 *                         imageUrl: "/images/flowers/cherry_blossom.png"
 *                         name: "벚꽃"
 *                         isLiked: false
 *                         colors: ["#F8BBD0", "#E91E63"]
 *                         tags: ["순결", "절세미인"]
 *                     total: 45
 *                     page: 1
 *                     limit: 20
 *                     has_next_page: true
 *               flower_list_no_login:
 *                 summary: "비로그인 조회 (isLiked 키 없음)"
 *                 value:
 *                   success: true
 *                   data:
 *                     default_season: "spring"
 *                     flowers:
 *                       - id: "1"
 *                         imageUrl: "/images/flowers/tulip.png"
 *                         name: "튤립"
 *                         colors: ["#F8BBD0", "#FF4D6D"]
 *                         tags: ["사랑의 고백", "영원한 애정"]
 *                     total: 120
 *                     page: 1
 *                     limit: 20
 *                     has_next_page: true
 *       400:
 *         description: 잘못된 필터값 (색상명 오류 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "존재하지 않는 색상입니다: 초록" }
 *                 validColors: { type: array, items: { type: string }, example: ["빨강", "분홍", "노랑"] }
 *             examples:
 *               invalid_color_filter:
 *                 summary: "잘못된 색상 필터"
 *                 value:
 *                   error: "존재하지 않는 색상입니다: 초록"
 *                   validColors: ["빨강", "분홍", "노랑", "주황", "노랑", "파랑", "흰색", "보라"]
 *       500:
 *         description: 서버 내부 오류 (DB 조회 실패 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "꽃 목록 조회 중 오류가 발생했습니다." }
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // 파라미터 파싱
    const defaultSeason = getCurrentSeason();
    const seasonsParam = searchParams.get('seasons');
    const colorsParam = searchParams.get('colors');
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'name';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // 계절 필터
    const seasons = seasonsParam
      ? seasonsParam.split(',').map(s => s.trim())
      : null;

    // 색상 필터
    const colors = colorsParam
      ? colorsParam.split(',').map(c => c.trim()).filter(Boolean)
      : [];

    // 현재 사용자 확인 (좋아요 여부 표시용)
    const user = await getUser();
    let userLikes: Set<number> = new Set();

    if (user) {
      const { data: publicUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (publicUser) {
        const { data: likes } = await supabase
          .from('user_flower_likes')
          .select('flower_id')
          .eq('user_id', publicUser.id);

        if (likes) {
          userLikes = new Set(likes.map(l => l.flower_id));
        }
      }
    }

    // 색상 필터가 있는 경우 뷰를 사용하여 유효성 검사 및 flower_id 조회
    let colorFilteredFlowerIds: number[] | null = null;

    if (colors.length > 0) {
      // 1단계: DB에 존재하는 색상 목록 조회
      const { data: validColorsData, error: validColorsError } = await supabase
        .from('flowers_with_meanings_view')
        .select('color')
        .not('color', 'is', null);

      if (validColorsError) {
        console.error('Valid colors query error:', validColorsError);
        return NextResponse.json(
          { error: '색상 목록 조회 중 오류가 발생했습니다.' },
          { status: 500 },
        );
      }

      // 유효한 색상 목록 (중복 제거)
      const validColors = [...new Set(validColorsData?.map(d => d.color) || [])];

      // 입력된 색상 중 유효하지 않은 색상 확인
      const invalidColors = colors.filter(c => !validColors.includes(c));

      if (invalidColors.length > 0) {
        return NextResponse.json(
          {
            error: `존재하지 않는 색상입니다: ${invalidColors.join(', ')}`,
            validColors,
          },
          { status: 400 },
        );
      }

      // 2단계: 유효한 색상으로 flower_id 조회
      const { data: colorMatches, error: colorError } = await supabase
        .from('flowers_with_meanings_view')
        .select('flower_id')
        .in('color', colors);

      if (colorError) {
        console.error('Color filter query error:', colorError);
        return NextResponse.json(
          { error: '색상 필터 조회 중 오류가 발생했습니다.' },
          { status: 500 },
        );
      }

      // 중복 제거된 flower_id 목록
      colorFilteredFlowerIds = [...new Set(colorMatches?.map(m => m.flower_id) || [])];

      // 색상 필터에 매칭되는 꽃이 없으면 빈 결과 반환
      if (colorFilteredFlowerIds.length === 0) {
        return NextResponse.json({
          success: true,
          data: {
            default_season: defaultSeason,
            flowers: [],
            total: 0,
            page,
            limit,
          },
        });
      }
    }

    // 꽃 데이터 조회 (최적화된 컬럼 선택)
    let query = supabase
      .from('flowers_with_counts_view')
      .select(`
        id, name_ko, images, representative_meanings_tags, availability,
        flower_meanings (icon_color, is_primary, meaning)
      `, { count: 'exact' })
      .eq('availability', true);

    // 색상 필터 적용 (flower_id로 필터)
    if (colorFilteredFlowerIds !== null) {
      query = query.in('id', colorFilteredFlowerIds);
    }

    // 계절 필터 적용 (seasons 파라미터가 있을 때만)
    if (seasons) {
      query = query.or(
        `${seasons.map(s => `seasons.cs.{${s}}`).join(',')},seasons.cs.{all_year}`,
      );
    }

    // 검색어 필터 (꽃 이름 + 꽃말 검색)
    if (search) {
      // 1단계: 꽃말에서 검색어 매칭되는 flower_id 조회
      const { data: meaningMatches } = await supabase
        .from('flower_meanings')
        .select('flower_id')
        .ilike('meaning', `%${search}%`);

      const meaningMatchedIds = meaningMatches?.map(m => m.flower_id) || [];

      // 2단계: 꽃 이름 OR 꽃말 매칭 ID로 필터
      if (meaningMatchedIds.length > 0) {
        query = query.or(`name_ko.ilike.%${search}%,id.in.(${meaningMatchedIds.join(',')})`);
      } else {
        query = query.ilike('name_ko', `%${search}%`);
      }
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // 정렬 (name: 이름순)
    if (sort === 'name') {
      query = query.order('name_ko', { ascending: true });
    } else {
      // popular: like_count순으로 정렬 (동률일 경우 id순)
      query = query.order('like_count', { ascending: false });
      query = query.order('id', { ascending: true });
    }

    const { data: flowers, error, count } = await query;

    if (error) {
      console.error('Flower dictionary query error:', error);
      return NextResponse.json(
        { error: '꽃 목록 조회 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }

    const filteredFlowers = flowers || [];

    // FlowerCard에 맞는 형태로 변환
    const formattedFlowers = filteredFlowers.map(flower => {
      const meanings = (flower.flower_meanings || []) as Array<{
        icon_color?: string | null;
        is_primary?: boolean | null;
        meaning?: string | null;
      }>;

      // 색상 추출 (icon_color)
      const flowerColors = [...new Set(
        meanings
          .map(m => m.icon_color)
          .filter((color): color is string => Boolean(color)),
      )];

      // 태그 추출 (신규 컬럼 우선, 없으면 조인 데이터에서 추출)
      let tags = flower.representative_meanings_tags?.slice(0, 3) || [];

      if (tags.length === 0) {
        tags = meanings
          .filter((m): m is { is_primary: boolean; meaning: string } => Boolean(m.is_primary) && typeof m.meaning === 'string')
          .map(m => m.meaning)
          .slice(0, 3);
      }

      const imageUrl = toSupabaseResizedImageUrl((flower.images as string[])?.[0]) || '/temp_tulip.png';

      return {
        id: String(flower.id),
        imageUrl,
        name: flower.name_ko,
        isLiked: user ? userLikes.has(flower.id) : undefined,
        colors: flowerColors,
        tags,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        default_season: defaultSeason,
        flowers: formattedFlowers,
        total: count || 0,
        page,
        limit,
        has_next_page: (count || 0) > page * limit,
      },
    });
  } catch (error) {
    console.error('Flower dictionary error:', error);
    return NextResponse.json(
      { error: '꽃 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
