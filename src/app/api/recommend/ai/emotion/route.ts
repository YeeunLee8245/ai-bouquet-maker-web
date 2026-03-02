import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';
import { analyzeEmotion } from '@services/emotion-analysis';
import { getRecommendationsFromAnalysis } from '@/lib/recommend/recommendation';
import { spendToken, getUserBalance } from '@/lib/users/wallet';
import { toSupabaseResizedImageUrl } from '@shared/utils/image-url';

/**
 * @swagger
 * /api/recommend/ai/emotion:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: AI 감정 기반 꽃 추천
 *     description: |
 *       사용자의 감정이나 고민, 상황 텍스트를 AI가 심층 분석하여 어울리는 꽃들을 추천합니다.
 *       단순 키워드 매칭이 아닌 문맥을 파악한 감성적인 접근을 제공합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **비용**: 요청 성공 시 **토큰 1개**가 소진됩니다. (실패 시 차감되지 않음)
 *       - **제한**: 텍스트는 최소 10자 이상 입력해야 더 정확한 분석이 가능합니다.
 *       - **결과 활용**: 추천된 꽃 목록(`recommendations`)과 함께 AI가 작성한 제목(`title`), 메시지(`message`)를 함께 보여주어 감동을 더할 수 있습니다.
 *
 *       <details>
 *       <summary>⚙️ 처리 순서 (클릭하여 펼치기)</summary>
 *
 *       ```
 *       1. 토큰 잔액 확인 (부족 시 403 반환)
 *       2. 사용자 조회
 *       3. DB INSERT (status='pending')
 *       4. AI 분석 수행 (OpenAI 감정 분석)
 *       5. 결과 UPDATE
 *          ├─ 성공: status='success' + 결과 저장 → 토큰 차감
 *          └─ 실패: status='failed' + error_msg 저장 (토큰 차감 X)
 *       ```
 *       </details>
 *
 *       <details>
 *       <summary>📊 점수 계산 방식 (클릭하여 펼치기)</summary>
 *
 *       | 요소 | 가중치 | 설명 |
 *       |------|--------|------|
 *       | emotion_tags 매칭 | **6점** | 감정 태그 매칭 (최우선) |
 *       | situation_tags 매칭 | **5점** | 상황 태그 매칭 |
 *       | relation_tags 매칭 | **3점** | 관계 태그 매칭 |
 *       | style_tags 매칭 | **2점** | 스타일 태그 매칭 |
 *       | AI 추천 꽃 보너스 | **+18점** | AI가 직접 추천한 꽃 |
 *       | 추천 색상 매칭 | **+6점** | AI 추천 색상과 일치 |
 *       | 대표 꽃말 보너스 | **+2점** | is_primary가 true인 꽃말 |
 *
 *       **계절 필터링**: 현재 계절에 맞는 꽃만 추천 리스트에 포함됩니다.
 *       </details>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: "사용자가 입력한 현재의 감정이나 상황 (예: 오늘 퇴사했는데 시원섭섭해요)"
 *                 example: "오랜 친구가 결혼을 한다고 해서 축하해주고 싶어요. 너무 화려하지 않으면서도 진심이 느껴지는 꽃을 찾고 있어요."
 *     responses:
 *       200:
 *         description: AI 추천 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, recommendationId, recommendations]
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 recommendationId: { type: string, format: uuid, description: "생성된 추천 기록 고유 ID" }
 *                 totalCount: { type: integer, description: "필터링 후 반환된 꽃의 개수" }
 *                 title: { type: string, description: "AI가 생성한 추천 꽃다발 제목", example: "진심을 전하는 수수한 축하 꽃다발" }
 *                 message: { type: string, description: "AI가 작성한 추천 이유와 위로의 메시지", example: "친구분의 결혼을 진심으로 축하드려요. 화려함보다는 변치 않는 우정을 상징하는..." }
 *                 recipient: { type: string, nullable: true, description: "분석된 선물 대상", example: "오랜 친구" }
 *                 occasion: { type: string, nullable: true, description: "분석된 선물 상황", example: "결혼 축하" }
 *                 recommendations:
 *                   type: array
 *                   description: "추천된 꽃 목록 (점수 높은 순)"
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, example: 12 }
 *                       flowerMeaningId: { type: integer, example: 24 }
 *                       name: { type: string, example: "안개꽃" }
 *                       meaning: { type: string, description: "매칭된 꽃말", example: "순수한 마음" }
 *                       tags: { type: array, items: { type: string }, example: ['매칭 꽃말', '대표1', '대표2'], description: '매칭된 꽃말 우선 + 대표 꽃말 (최대 3개)' }
 *                       colors: { type: array, items: { type: string }, description: "꽃 색상 코드(HEX) 목록", example: ["#FFFFFF", "#FFB6C1"] }
 *                       score: { type: integer, description: "매칭 점수", example: 45 }
 *                       imageUrl: { type: string, nullable: true, example: "https://.../flower.png", description: "flowers.images[0]" }
 *             examples:
 *               ai_recommendation_success:
 *                 summary: "AI 감정 분석 추천 성공"
 *                 value:
 *                   success: true
 *                   recommendationId: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *                   totalCount: 5
 *                   title: "지친 당신을 위한 위로의 꽃다발"
 *                   message: "오늘 하루 정말 고생 많으셨어요. 당신의 지친 마음을 달래줄 수 있는..."
 *                   recipient: "나 자신"
 *                   occasion: "위로와 응원"
 *                   recommendations:
 *                     - id: 12
 *                       flowerMeaningId: 24
 *                       name: "안개꽃"
 *                       meaning: "순수한 마음"
 *                       tags: ['순수한 마음', '우정', '감사']
 *                       colors: ["#FFFFFF", "#FFB6C1"]
 *                       score: 45
 *                       imageUrl: "https://example.com/flowers/gypsophila.png"
 *               ai_recommendation_success_without_target_or_occasion:
 *                 summary: "대상/상황 미추출 시 null 반환 예시"
 *                 value:
 *                   success: true
 *                   recommendationId: "3b7fe1a8-1d50-4c2e-927c-4dc82f4f1a11"
 *                   totalCount: 2
 *                   title: "오늘 하루를 위한 작은 위로"
 *                   message: "대상이나 특정 상황이 없어도 감정 중심으로 어울리는 꽃을 추천해드려요."
 *                   recipient: null
 *                   occasion: null
 *                   recommendations:
 *                     - id: 8
 *                       flowerMeaningId: 19
 *                       name: "리시안셔스"
 *                       meaning: "변하지 않는 사랑"
 *                       tags: ['변하지 않는 사랑', '우아함', '희망']
 *                       colors: ["#9B59B6", "#F5CBA7"]
 *                       score: 39
 *                       imageUrl: "https://example.com/flowers/lisianthus.png"
 *       400:
 *         description: 입력값 오류 (너무 짧거나 긴 텍스트)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "좀 더 자세히 설명해주세요. (최소 10자)" }
 *       401:
 *         description: 로그인 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "로그인이 필요한 서비스입니다." }
 *       403:
 *         description: 토큰 부족
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "사용 가능한 토큰 부족" }
 *       500:
 *         description: AI 서버 또는 DB 오류
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 및 사용자 정보 확인
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { text } = body;

    // 입력 검증
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

    // AI 분석 전 토큰 선검사
    const balance = await getUserBalance(publicUser.id);
    if (balance < 1) {
      return NextResponse.json(
        { error: '사용 가능한 토큰 부족' },
        { status: 403 },
      );
    }

    const supabase = await createClient();

    // pending 상태로 먼저 저장
    const { data: pendingRecommendation, error: insertError } = await supabase
      .from('recommendations')
      .insert({
        user_id: publicUser.id,
        recommendation_type: 'emotion',
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
      // AI 분석
      const analysis = await analyzeEmotion(text);

      // 점수 계산 및 꽃 추천
      const { recommendations, ranked } = await getRecommendationsFromAnalysis(analysis, 'emotion');

      // 성공: status를 success로 업데이트 + 결과 저장
      await supabase
        .from('recommendations')
        .update({
          status: 'success',
          analysis_result: analysis,
          relationship: analysis.recipient || null, // AI가 추출한 받는사람
          occasion: analysis.occasion || null,     // AI가 추출한 상황
          recommended_flowers: ranked,
          updated_at: new Date().toISOString(),
        })
        .eq('id', recommendationId);

      // 토큰 차감 (성공 시에만)
      try {
        await spendToken(
          publicUser.id,
          recommendationId,
          'recommendations',
          'uuid',
          'AI 감정 기반 꽃 추천',
        );
      } catch (tokenError: unknown) {
        const errorMessage = tokenError instanceof Error ? tokenError.message : '토큰 차감 실패';
        // 토큰 차감 실패 시 status를 failed로 변경
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

      // 표준화된 응답 형식으로 변환
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
      // AI 분석 실패: status를 failed로 업데이트 (토큰 차감 안 함)
      console.error('AI Emotion Analysis Error:', aiError);
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
    console.error('AI Emotion Recommend Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
