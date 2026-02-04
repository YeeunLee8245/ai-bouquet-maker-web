import { NextResponse } from 'next/server';
import { createClient } from '@/shared/supabase/server';
import { relationshipTemplates } from '@/lib/recommend/relationship-templates';
import { FlowerWithMeanings } from '@/types/flower';

/**
 * @swagger
 * /api/main:
 *   get:
 *     tags:
 *       - Main
 *     summary: 홈 화면 데이터 조회
 *     description: 홈 화면에 필요한 빠른 대상 추천, 인기 꽃(최근 24시간), 오늘의 꽃 정보를 조회합니다.
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
 *                   required: [recipients, popularFlowers, todaysFlower]
 *                   properties:
 *                     recipients:
 *                       type: array
 *                       description: "빠른 대상 추천 리스트 (프론트엔드 홈 화면 상단 노출용)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, description: "관계 슬러그 (추천 API 파라미터로 사용)", example: "lover" }
 *                           label: { type: string, description: "표시 이름", example: "연인" }
 *                           description: { type: string, description: "보조 설명", example: "고백, 기념일, 평범한 날의 선물" }
 *                     popularFlowers:
 *                       type: array
 *                       description: "인기 꽃 리스트 (최근 24시간 내 좋아요 및 활동 기반 랜덤 10개)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, example: 1 }
 *                           name_ko: { type: string, example: "장미" }
 *                           image_url: { type: string, example: "https://.../rose.png" }
 *                           representative_meanings: { type: array, items: { type: string }, example: ["진심 어린 사랑", "행복한 사랑"] }
 *                     todaysFlower:
 *                       type: object
 *                       description: "오늘의 꽃 (현재 계절 + 주간 인기 꽃 조합)"
 *                       nullable: true
 *                       properties:
 *                         id: { type: integer, example: 12 }
 *                         name_ko: { type: string, example: "프리지아" }
 *                         image_url: { type: string, example: "https://.../freesia.png" }
 *                         description: { type: string, example: "봄의 전령사라고 불리는 프리지아는..." }
 *                         representative_meanings: { type: array, items: { type: string }, example: ["응원", "새로운 시작"] }
 *                         seasons: { type: array, items: { type: string }, example: ["봄"] }
 *             examples:
 *               main_data_success:
 *                 summary: "홈 데이터 조회 성공 예시"
 *                 value:
 *                   success: true
 *                   data:
 *                     recipients:
 *                       - id: "lover"
 *                         label: "연인"
 *                         description: "고백, 기념일용"
 *                       - id: "parents"
 *                         label: "부모님"
 *                         description: "감사와 존경"
 *                     popularFlowers:
 *                       - id: 1
 *                         name_ko: "장미"
 *                         image_url: "https://example.com/flowers/rose.png"
 *                         representative_meanings: ["사랑"]
 *                     todaysFlower:
 *                       id: 12
 *                       name_ko: "프리지아"
 *                       image_url: "https://example.com/flowers/freesia.png"
 *                       representative_meanings: ["응원"]
 *                       seasons: ["봄"]
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "서버 에러가 발생했습니다." }
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // 1. 빠른 대상 추천 리스트 가공
    const recipients = relationshipTemplates.map((template) => ({
      id: template.relationship,
      label: template.label,
      description: template.description,
    }));

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const currentMonth = now.getMonth() + 1;

    // 현재 계절 계산
    let currentSeason = '';
    if (currentMonth >= 3 && currentMonth <= 5) {
      currentSeason = '봄';
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      currentSeason = '여름';
    } else if (currentMonth >= 9 && currentMonth <= 11) {
      currentSeason = '가을';
    } else {
      currentSeason = '겨울';
    }

    // 2. 인기 꽃 추천 (최근 1일 좋아요 기반)
    // 조인을 통해 좋아요 수와 꽃 정보를 함께 가져오기 위해 RPC 또는 복합 쿼리 사용 가능하지만,
    // 여기서는 간단하게 user_flower_likes에서 flower_id를 집계합니다.
    const { data: popularLikes } = await supabase
      .from('user_flower_likes')
      .select('flower_id')
      .gt('created_at', oneDayAgo);

    const counts1d: Record<number, number> = {};
    popularLikes?.forEach((like) => {
      counts1d[like.flower_id] = (counts1d[like.flower_id] || 0) + 1;
    });

    // 좋아요가 있는 꽃 아이디들
    const popularFlowerIds = Object.keys(counts1d).map(Number);
    const flowerSelect = 'id, name_ko, image_url, meanings_tags, flower_meanings(meaning, is_primary)';

    let popularFlowersQuery = supabase
      .from('flowers')
      .select(flowerSelect);

    if (popularFlowerIds.length > 0) {
      // 좋아요가 있는 꽃들을 우선 조회
      popularFlowersQuery = popularFlowersQuery.in('id', popularFlowerIds);
    }

    const { data: popularFlowersData } = await popularFlowersQuery.limit(50);
    let popularFlowers = popularFlowersData || [];

    // 만약 10개보다 적다면 부족한 만큼만 전체에서 랜덤하게 채움
    if (popularFlowers.length < 10) {
      const needed = 10 - popularFlowers.length;
      const existingIds = popularFlowers.map((f) => f.id);

      let extraQuery = supabase
        .from('flowers')
        .select(flowerSelect);

      if (existingIds.length > 0) {
        extraQuery = extraQuery.not('id', 'in', `(${existingIds.join(',')})`);
      }

      const { data: extraFlowers } = await extraQuery.limit(needed + 5);
      const randomExtras = (extraFlowers || [])
        .sort(() => 0.5 - Math.random())
        .slice(0, needed);

      popularFlowers = [...popularFlowers, ...randomExtras];
    }

    // 랜덤으로 10개 섞기
    const shuffledPopular = (popularFlowers || [])
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    // 3. 오늘의 꽃 추천 (계절 + 1주일 좋아요 1위 기반)
    // 1주일간 좋아요 집계
    const { data: weekLikes } = await supabase
      .from('user_flower_likes')
      .select('flower_id')
      .gt('created_at', oneWeekAgo);

    const counts1w: Record<number, number> = {};
    weekLikes?.forEach((like) => {
      counts1w[like.flower_id] = (counts1w[like.flower_id] || 0) + 1;
    });

    const topFlowerId = Object.entries(counts1w)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    // 계절에 맞는 꽃들 조회
    const { data: seasonalFlowers } = await supabase
      .from('flowers')
      .select(`
        id, name_ko, image_url, description, meanings_tags, seasons, 
        blooming_start_month, blooming_end_month, 
        flower_meanings(meaning, is_primary)
      `)
      .or(`seasons.cs.{${currentSeason}}, and(blooming_start_month.lte.${currentMonth}, blooming_end_month.gte.${currentMonth})`);

    let todaysFlowerCandidate = null;

    if (topFlowerId) {
      // 1위 꽃이 계절에 맞는지 확인
      todaysFlowerCandidate = seasonalFlowers?.find((f) => f.id === Number(topFlowerId));
    }

    // 후보가 없으면 계절 꽃 중 랜덤, 계절 꽃도 없으면 전체 중 랜덤
    if (!todaysFlowerCandidate) {
      if (seasonalFlowers && seasonalFlowers.length > 0) {
        todaysFlowerCandidate = seasonalFlowers[Math.floor(Math.random() * seasonalFlowers.length)];
      } else {
        const { data: anyFlower } = await supabase
          .from('flowers')
          .select(`
            id, name_ko, image_url, description, meanings_tags, seasons, 
            blooming_start_month, blooming_end_month, 
            flower_meanings(meaning, is_primary)
          `)
          .limit(1)
          .single();
        todaysFlowerCandidate = anyFlower;
      }
    }

    // 4. 데이터 가공 (대표 의미 추출)
    const getRepresentativeMeanings = (flower: FlowerWithMeanings) => {
      const f = flower as FlowerWithMeanings;
      const meanings = f.flower_meanings || [];
      const primaryMeanings = meanings
        .filter((m) => m.is_primary)
        .map((m) => m.meaning);
      if (primaryMeanings.length > 0) {
        return primaryMeanings.slice(0, 2);
      }
      return meanings.map((m) => m.meaning).slice(0, 2);
    };

    const processedPopular = shuffledPopular.map((f) => ({
      ...f,
      representative_meanings: getRepresentativeMeanings(f as unknown as FlowerWithMeanings),
    }));

    const processedTodaysFlower = todaysFlowerCandidate ? {
      ...todaysFlowerCandidate,
      representative_meanings: getRepresentativeMeanings(todaysFlowerCandidate as unknown as FlowerWithMeanings),
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        recipients,
        popularFlowers: processedPopular,
        todaysFlower: processedTodaysFlower,
      },
    });
  } catch (error) {
    console.error('Main API Error:', error);
    return NextResponse.json(
      { success: false, message: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
