import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';
import { analyzeGeneral } from '@services/general-analysis';
import { getRecommendationsFromAnalysis } from '@/lib/recommend/recommendation';
import { spendToken, getUserBalance } from '@/lib/users/wallet';

/**
 * @swagger
 * /api/recommend/ai/general:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: AI 기본 추천
 *     description: 사용자 자연어를 분석해 모든 태그(emotion/situation/relation/style)에 동일 가중치로 꽃을 추천합니다.
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

      const standardizedRecommendations = recommendations.map(rec => {
        const matchedMeaning = rec.flower.flower_meanings?.find(m => m.id === rec.flowerMeaningId)?.meaning || '';
        const representativeTags = Array.isArray(rec.flower.representative_meanings_tags)
          ? rec.flower.representative_meanings_tags
          : [];
        const tags = [...new Set([matchedMeaning, ...representativeTags].filter(Boolean))].slice(0, 3);

        return {
          id: rec.flower.id,
          flowerMeaningId: rec.flowerMeaningId || 0,
          name: rec.flower.name_ko,
          meaning: matchedMeaning,
          tags,
          colors: rec.flower.colors || [...new Set(
            (rec.flower.flower_meanings || [])
              .map(m => m.icon_color)
              .filter((color): color is string => Boolean(color)),
          )],
          score: rec.score,
          imageUrl: rec.flower.images?.[0] || null,
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
