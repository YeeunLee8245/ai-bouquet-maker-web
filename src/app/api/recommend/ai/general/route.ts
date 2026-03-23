import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';
import { analyzeGeneral } from '@services/general-analysis';
import { getRecommendationsFromAnalysis } from '@/lib/recommend/recommendation';
import { spendToken, getUserBalance } from '@/lib/users/wallet';
import { toSupabaseResizedImageUrl } from '@shared/utils/image-url';

/**
 * @swagger
 * /api/recommend/ai/general:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: AI 기본 추천
 *     description: |
 *       사용자의 자연어 입력을 AI가 분석하여 모든 태그 유형(emotion/situation/relation/style)에
 *       동일한 가중치를 적용해 꽃을 추천합니다.
 *
 *       **토큰 차감:** 성공 시 1토큰이 차감됩니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: 꽃 추천을 위한 자연어 설명 (최소 10자, 최대 1000자)
 *                 example: "친구의 생일을 축하해주고 싶어요. 밝고 활기찬 느낌으로 부탁드려요."
 *     responses:
 *       200:
 *         description: 추천 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 recommendationId:
 *                   type: string
 *                   format: uuid
 *                   description: 추천 기록 ID
 *                 totalCount:
 *                   type: integer
 *                   description: 추천된 꽃 개수
 *                   example: 5
 *                 title:
 *                   type: string
 *                   description: AI가 생성한 추천 제목
 *                   example: "친구의 생일을 축하하는 꽃다발"
 *                 message:
 *                   type: string
 *                   description: AI가 생성한 추천 메시지
 *                   example: "밝고 활기찬 느낌의 꽃들로 구성했어요."
 *                 recipient:
 *                   type: string
 *                   nullable: true
 *                   description: 분석된 수신자 정보
 *                   example: "친구"
 *                 occasion:
 *                   type: string
 *                   nullable: true
 *                   description: 분석된 상황 정보
 *                   example: "생일"
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: 꽃 ID
 *                       flowerMeaningId:
 *                         type: string
 *                         description: 매칭된 꽃말 ID
 *                       name:
 *                         type: string
 *                         description: 꽃 이름
 *                         example: "해바라기"
 *                       meaning:
 *                         type: string
 *                         description: 매칭된 꽃말
 *                         example: "행복한 미래"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: 대표 태그 (최대 3개)
 *                       colors:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: 꽃 색상 목록
 *                       score:
 *                         type: number
 *                         description: 추천 점수
 *                       imageUrl:
 *                         type: string
 *                         description: 꽃 이미지 URL
 *       400:
 *         description: 잘못된 요청 (텍스트 누락, 길이 제한 위반)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "텍스트를 입력해주세요."
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "로그인이 필요한 서비스입니다."
 *       403:
 *         description: 토큰 부족
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "사용 가능한 토큰 부족"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "추천 중 오류가 발생했습니다."
 */
export async function POST(request: NextRequest) {
  try {
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '텍스트를 입력해주세요.' },
        { status: 400 },
      );
    }

    if (text.length < 10) {
      return NextResponse.json(
        { error: '좀 더 자세히 설명해주세요. (최소 10자)' },
        { status: 400 },
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: '텍스트가 너무 깁니다. (최대 1000자)' },
        { status: 400 },
      );
    }

    const balance = await getUserBalance(publicUser.id);
    if (balance < 1) {
      return NextResponse.json(
        { error: '사용 가능한 토큰 부족' },
        { status: 403 },
      );
    }

    const supabase = await createClient();

    const { data: pendingRecommendation, error: insertError } = await supabase
      .from('recommendations')
      .insert({
        user_id: publicUser.id,
        recommendation_type: 'general',
        input_text: text,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertError || !pendingRecommendation) {
      console.error('Failed to create pending recommendation:', insertError);
      return NextResponse.json(
        { error: '추천 요청 생성에 실패했습니다.' },
        { status: 500 },
      );
    }

    const recommendationId = pendingRecommendation.id;

    try {
      const analysis = await analyzeGeneral(text);
      const { recommendations, ranked } = await getRecommendationsFromAnalysis(analysis, 'general');

      await supabase
        .from('recommendations')
        .update({
          status: 'success',
          analysis_result: analysis,
          relationship: analysis.recipient || null,
          occasion: analysis.occasion || null,
          recommended_flowers: ranked,
          updated_at: new Date().toISOString(),
        })
        .eq('id', recommendationId);

      try {
        await spendToken(
          publicUser.id,
          recommendationId,
          'recommendations',
          'uuid',
          'AI 기본 꽃 추천',
        );
      } catch (tokenError: unknown) {
        const errorMessage = tokenError instanceof Error ? tokenError.message : '토큰 차감 실패';
        await supabase
          .from('recommendations')
          .update({
            status: 'failed',
            error_msg: errorMessage,
            updated_at: new Date().toISOString(),
          })
          .eq('id', recommendationId);

        return NextResponse.json(
          { error: errorMessage },
          { status: 403 },
        );
      }

      // 중복 꽃 제거를 위한 Set
      const seenFlowerIds = new Set<string>();
      const standardizedRecommendations = recommendations
        .filter(rec => {
          const flowerId = String(rec.flower.id);
          if (seenFlowerIds.has(flowerId)) {return false;}
          seenFlowerIds.add(flowerId);
          return true;
        })
        .map(rec => {
          // 매칭된 꽃말 + 대표 태그 조합
          const matchedMeaning = rec.flower.flower_meanings?.find(m => String(m.id) === rec.flowerMeaningId)?.meaning || '';
          const representativeTags = Array.isArray(rec.flower.representative_meanings_tags)
            ? rec.flower.representative_meanings_tags
            : [];
          // 매칭된 꽃말을 첫번째로, 그 다음 대표 태그 (중복 제거)
          const tags = [...new Set([matchedMeaning, ...representativeTags].filter(Boolean))].slice(0, 3);

          // is_primary가 true인 경우 기본값(회색)이 들어있으므로 제외
          const colors = rec.flower.colors || [...new Set(
            (rec.flower.flower_meanings || [])
              .filter(m => !m.is_primary && m.icon_color)
              .map(m => m.icon_color)
              .filter((color): color is string => Boolean(color)),
          )];

          return {
            id: String(rec.flower.id),
            flowerMeaningId: String(rec.flowerMeaningId || '0'),
            name: rec.flower.name_ko,
            meaning: matchedMeaning,
            tags,
            colors,
            score: rec.score,
            imageUrl: toSupabaseResizedImageUrl(rec.flower.images?.[0]),
          };
        });

      return NextResponse.json({
        success: true,
        recommendationId,
        totalCount: standardizedRecommendations.length,
        title: analysis.title,
        message: analysis.message,
        recipient: analysis.recipient || null,
        occasion: analysis.occasion || null,
        recommendations: standardizedRecommendations,
      });
    } catch (aiError: unknown) {
      console.error('AI General Analysis Error:', aiError);
      const errorMessage = aiError instanceof Error ? aiError.message : 'AI 분석 중 오류 발생';
      await supabase
        .from('recommendations')
        .update({
          status: 'failed',
          error_msg: errorMessage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', recommendationId);

      return NextResponse.json(
        { error: '추천 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('AI General Recommend Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
