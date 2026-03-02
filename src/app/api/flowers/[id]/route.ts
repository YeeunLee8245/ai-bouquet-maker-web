import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getUser } from '@/lib/users/auth';
import { toSupabaseResizedImageUrl } from '@shared/utils/image-url';

/**
 * @swagger
 * /api/flowers/{id}:
 *   get:
 *     tags:
 *       - Flowers
 *     summary: 꽃 상세 정보 조회
 *     description: |
 *       특정 꽃의 상세 정보를 조회합니다. 이미지 목록, 상세 꽃말, 관리 방법(Care Tips), 유사한 꽃 추천 정보를 포함합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **`meanings`**: 해당 꽃이 가진 모든 색상/상황별 꽃말 목록입니다. `is_primary`가 `true`인 항목을 대표 꽃말로 노출하세요.
 *       - **`similar_flowers`**: 현재 꽃과 감정 태그가 겹치거나 같은 계절인 꽃들을 추천합니다. 클릭 시 해당 꽃 상세 페이지로 이동하도록 구현하세요.
 *       - **이미지 갤러리**: `images` 배열에 여러 장의 이미지가 있을 수 있으니 슬라이더 등으로 구현하는 것을 추천합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 꽃의 고유 ID (Integer)
 *         schema:
 *           type: integer
 *         example: 1
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
 *                   required: [id, name_ko, meanings]
 *                   properties:
 *                     id: { type: integer, example: 1 }
 *                     name_ko: { type: string, description: "한글 이름", example: "장미" }
 *                     name_en: { type: string, description: "영문 이름", example: "Rose" }
 *                     scientific_name: { type: string, description: "학명", example: "Rosa" }
 *                     description: { type: string, description: "꽃에 대한 일반적인 설명", example: "장미는 장미과 장미속에 속하는 관목의 총칭입니다." }
 *                     care_tips: { type: string, description: "오래 보관하기 위한 관리 팁", example: "줄기 끝을 사선으로 자르고 매일 물을 갈아주세요." }
 *                     plus_info: { type: string, description: "추가 상식 또는 유의사항", example: "가시가 있으니 다룰 때 주의하세요." }
 *                     images:
 *                       type: array
 *                       description: "상세 페이지용 이미지 URL 목록"
 *                       items: { type: string }
 *                       example: ["https://example.com/rose1.jpg", "https://example.com/rose2.jpg"]
 *                     blooming_start_month: { type: integer, description: "개화 시작 월", example: 5 }
 *                     blooming_end_month: { type: integer, description: "개화 종료 월", example: 6 }
 *                     seasons:
 *                       type: array
 *                       description: "주요 활동 계절"
 *                       items: { type: string }
 *                       example: ["spring", "summer"]
 *                     isLiked: { type: boolean, nullable: true, description: "로그인 유저의 좋아요 여부", example: false }
 *                     meanings:
 *                       type: array
 *                       description: "꽃말 상세 목록 (색상별/상징별)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, example: 101 }
 *                           meaning: { type: string, example: "불타는 사랑", description: "꽃말 텍스트" }
 *                           color: { type: string, example: "빨강", description: "꽃말과 연관된 색상명" }
 *                           icon_color: { type: string, example: "#FF0000", description: "상징 색상 코드" }
 *                           is_primary: { type: boolean, example: true, description: "대표 꽃말 여부" }
 *                           emotion_tags: { type: array, items: { type: string }, example: ["사랑", "열정"] }
 *                     similar_flowers:
 *                       type: array
 *                       description: "연관 추천 꽃 (최대 4개)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, example: "5" }
 *                           name: { type: string, example: "카네이션" }
 *                           imageUrl: { type: string, example: "/images/flowers/carnation.png" }
 *                           tags: { type: array, items: { type: string }, example: ["감사", "존경"] }
 *             examples:
 *               flower_detail_success:
 *                 summary: "꽃 상세 조회 성공 (장미 예시)"
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 1
 *                     name_ko: "장미"
 *                     name_en: "Rose"
 *                     description: "장미는 사랑의 상징으로..."
 *                     care_tips: "줄기를 사선으로 자르고..."
 *                     plus_info: "가시를 제거할 때..."
 *                     images: ["/rose1.jpg", "/rose2.jpg"]
 *                     isLiked: true
 *                     meanings:
 *                       - id: 101
 *                         meaning: "불타는 사랑"
 *                         color: "빨강"
 *                         icon_color: "#FF0000"
 *                         is_primary: true
 *                         emotion_tags: ["열정", "고백"]
 *                     similar_flowers:
 *                       - id: "5"
 *                         name: "카네이션"
 *                         imageUrl: "/carnation.png"
 *                         tags: ["감사", "존경"]
 *       404:
 *         description: 꽃을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "꽃 정보를 찾을 수 없습니다." }
 *       500:
 *         description: 서버 내부 오류
 */
export async function GET(
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

    const supabase = await createClient();

    // 꽃 상세 정보 조회 (flower_meanings 포함)
    const { data: flower, error } = await supabase
      .from('flowers')
      .select(`
        *,
        flower_meanings (*)
      `)
      .eq('id', flowerId)
      .single();

    if (error || !flower) {
      return NextResponse.json(
        { error: '꽃을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 현재 사용자 확인 (좋아요 여부)
    let isLiked: boolean | undefined = undefined;
    const user = await getUser();

    if (user) {
      const { data: publicUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (publicUser) {
        const { data: like } = await supabase
          .from('user_flower_likes')
          .select('id')
          .eq('user_id', publicUser.id)
          .eq('flower_id', flowerId)
          .single();

        isLiked = !!like;
      }
    }

    // 유사한 꽃 조회: 감정 태그 매칭 우선, 이후 같은 계절로 채움
    const currentSeasons = flower.seasons || [];
    const emotionTags: string[] = flower.flower_meanings
      ?.flatMap((m: { emotion_tags?: string[] | null }) => m.emotion_tags || []) || [];
    const uniqueEmotionTags = [...new Set(emotionTags)].slice(0, 5);

    // 모든 후보 꽃 조회 (같은 계절)
    let candidateQuery = supabase
      .from('flowers')
      .select(`
        id,
        name_ko,
        images,
        representative_meanings_tags,
        flower_meanings (meaning, is_primary, emotion_tags)
      `)
      .neq('id', flowerId)
      .eq('availability', true);

    if (currentSeasons.length > 0) {
      candidateQuery = candidateQuery.or(
        currentSeasons.map((s: string) => `seasons.cs.{${s}}`).join(','),
      );
    }

    const { data: candidateFlowers } = await candidateQuery;

    // 감정 태그 매칭 점수 계산 및 정렬
    type CandidateFlower = {
      id: number;
      name_ko: string;
      images?: string[] | null;
      representative_meanings_tags?: string[] | null;
      flower_meanings?: { meaning: string; is_primary?: boolean; emotion_tags?: string[] | null }[];
    };

    const scoredFlowers = ((candidateFlowers || []) as CandidateFlower[]).map((f) => {
      const flowerEmotionTags = (f.flower_meanings || [])
        .flatMap(m => m.emotion_tags || []);
      const matchCount = uniqueEmotionTags.filter(tag => flowerEmotionTags.includes(tag)).length;
      return { ...f, matchScore: matchCount };
    });

    // 점수 높은 순 정렬, 상위 4개 선택
    scoredFlowers.sort((a, b) => b.matchScore - a.matchScore);
    const similarFlowers = scoredFlowers.slice(0, 4);

    // 응답 데이터 구성
    const meanings = (flower.flower_meanings || []).map((m: {
      id: number;
      color?: string | null;
      icon_color?: string | null;
      meaning: string;
      is_primary?: boolean;
      emotion_tags?: string[] | null;
    }) => ({
      id: m.id,
      color: m.color,
      icon_color: m.icon_color,
      meaning: m.meaning,
      is_primary: m.is_primary,
      emotion_tags: m.emotion_tags,
    }));

    const formattedSimilarFlowers = (similarFlowers || []).map((f: CandidateFlower) => {
      const imageUrl = toSupabaseResizedImageUrl(f.images?.[0]) || '/temp_tulip.png';

      // 태그 추출 (신규 컬럼 우선)
      let tags = f.representative_meanings_tags?.slice(0, 2) || [];
      if (tags.length === 0) {
        tags = (f.flower_meanings || [])
          .filter(m => m.is_primary)
          .map(m => m.meaning)
          .slice(0, 2);
      }

      return {
        id: String(f.id),
        name: f.name_ko,
        imageUrl,
        tags,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        id: flower.id,
        name_ko: flower.name_ko,
        name_en: flower.name_en,
        scientific_name: flower.scientific_name,
        description: flower.description,
        care_tips: flower.care_tips,
        plus_info: flower.plus_info,
        images: flower.images || [],
        blooming_start_month: flower.blooming_start_month,
        blooming_end_month: flower.blooming_end_month,
        seasons: flower.seasons,
        isLiked,
        meanings,
        similar_flowers: formattedSimilarFlowers,
      },
    });
  } catch (error) {
    console.error('Flower detail error:', error);
    return NextResponse.json(
      { error: '꽃 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
