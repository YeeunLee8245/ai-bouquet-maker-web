import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';

/**
 * 현재 계절 가져오기 (서버 시간 기준)
 */
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
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
 *       필터, 검색, 정렬을 지원하는 꽃 사전 API
 *       
 *       **계절 기본값**: 서버 시간 기준 현재 계절
 *     parameters:
 *       - name: seasons
 *         in: query
 *         description: 계절 필터 (comma-separated, e.g. spring,summer)
 *         schema:
 *           type: string
 *       - name: colors
 *         in: query
 *         description: |
 *           색상 필터 (comma-separated)
 *           
 *           현재 지원 색상: 노랑, 보라, 분홍, 빨강, 주황, 파랑, 흰색
 *           (새로운 색상은 DB에 추가될 수 있음)
 *         schema:
 *           type: string
 *           example: 빨강,분홍
 *       - name: search
 *         in: query
 *         description: 꽃 이름/꽃말 검색
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         description: 정렬 기준 (popular, name)
 *         schema:
 *           type: string
 *           default: popular
 *       - name: page
 *         in: query
 *         description: 페이지 번호
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: 페이지당 개수
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     default_season:
 *                       type: string
 *                       description: 서버 시간 기준 기본 계절
 *                     flowers:
 *                       type: array
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     has_next_page:
 *                       type: boolean
 *                       description: 다음 페이지 존재 여부
 *       500:
 *         description: 서버 오류
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
    const sort = searchParams.get('sort') || 'popular';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    // 계절 필터 (기본값: 서버 시간 계절)
    const seasons = seasonsParam 
      ? seasonsParam.split(',').map(s => s.trim()) 
      : [defaultSeason];
    
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
          { status: 500 }
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
            validColors: validColors,
          },
          { status: 400 }
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
          { status: 500 }
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
    
    // 꽃 데이터 조회 (flower_meanings join)
    let query = supabase
      .from('flowers')
      .select(`
        *,
        flower_meanings (*)
      `, { count: 'exact' })
      .eq('availability', true);
    
    // 색상 필터 적용 (flower_id로 필터)
    if (colorFilteredFlowerIds !== null) {
      query = query.in('id', colorFilteredFlowerIds);
    }
    
    // 계절 필터 적용 (season이 seasons 배열에 포함되거나, all_year인 경우)
    query = query.or(
      seasons.map(s => `seasons.cs.{${s}}`).join(',') + ',seasons.cs.{all_year}'
    );
    
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
      // popular: 일단 id순으로 정렬 (추후 좋아요 수로 변경 가능)
      query = query.order('id', { ascending: true });
    }
    
    const { data: flowers, error, count } = await query;
    
    if (error) {
      console.error('Flower dictionary query error:', error);
      return NextResponse.json(
        { error: '꽃 목록 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    const filteredFlowers = flowers || [];
    
    // FlowerCard에 맞는 형태로 변환
    const formattedFlowers = filteredFlowers.map(flower => {
      const meanings = flower.flower_meanings || [];
      
      // 색상 추출 (icon_color)
      const flowerColors = [...new Set(
        meanings
          .map((m: { icon_color?: string | null }) => m.icon_color)
          .filter(Boolean)
      )];
      
      // 태그 추출 (꽃말)
      const tags = meanings
        .filter((m: { is_primary?: boolean }) => m.is_primary)
        .map((m: { meaning: string }) => m.meaning)
        .slice(0, 3);
      
      // 태그가 없으면 일반 꽃말에서 추출
      if (tags.length === 0) {
        tags.push(...meanings.map((m: { meaning: string }) => m.meaning).slice(0, 3));
      }
      
      return {
        id: String(flower.id),
        imageUrl: flower.image_url || '/temp_tulip.png',
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
      { status: 500 }
    );
  }
}
