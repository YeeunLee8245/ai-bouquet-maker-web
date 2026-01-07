import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';

/**
 * @swagger
 * /api/flowers/{id}:
 *   get:
 *     tags:
 *       - Flowers
 *     summary: 꽃 상세 정보 조회
 *     description: 꽃의 상세 정보를 조회합니다. (이미지, 꽃말, 개화시기, 관리팁, 유사한 꽃 등)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 꽃 ID
 *         schema:
 *           type: integer
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
 *                     id:
 *                       type: integer
 *                     name_ko:
 *                       type: string
 *                     name_en:
 *                       type: string
 *                     scientific_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     care_tips:
 *                       type: string
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     blooming_start_month:
 *                       type: integer
 *                     blooming_end_month:
 *                       type: integer
 *                     seasons:
 *                       type: array
 *                       items:
 *                         type: string
 *                     isLiked:
 *                       type: boolean
 *                     meanings:
 *                       type: array
 *                     similar_flowers:
 *                       type: array
 *       404:
 *         description: 꽃을 찾을 수 없음
 *       500:
 *         description: 서버 오류
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
        image_url,
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
      image_url?: string | null;
      flower_meanings?: { meaning: string; is_primary?: boolean; emotion_tags?: string[] | null }[];
    };

    const scoredFlowers = (candidateFlowers || []).map((f: CandidateFlower) => {
      const flowerEmotionTags = f.flower_meanings
        ?.flatMap(m => m.emotion_tags || []) || [];
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

    const formattedSimilarFlowers = (similarFlowers || []).map((f: {
      id: number;
      name_ko: string;
      image_url?: string | null;
      flower_meanings?: { meaning: string; is_primary?: boolean }[];
    }) => ({
      id: String(f.id),
      name: f.name_ko,
      imageUrl: f.image_url || '/temp_tulip.png',
      tags: (f.flower_meanings || [])
        .filter(m => m.is_primary)
        .map(m => m.meaning)
        .slice(0, 2),
    }));

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
        images: flower.images || [flower.image_url].filter(Boolean),
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
