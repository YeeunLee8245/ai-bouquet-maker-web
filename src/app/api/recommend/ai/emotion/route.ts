import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';
import { analyzeEmotion } from '@services/emotion-analysis';
import { getRecommendationsFromAnalysis } from '@/lib/recommend/recommendation';
import { spendToken, getUserBalance } from '@/lib/users/wallet';

/**
 * @swagger
 * /api/recommend/ai/emotion:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: AI 감정 기반 꽃 추천
 *     description: |
 *       사용자의 감정/상황 텍스트를 AI가 분석하여 꽃을 추천합니다.
 *       최대 10개의 추천 결과를 반환하며, 페이징을 지원하지 않습니다.
 *       **요청 1회당 AI 추천 토큰 1개가 소진됩니다. (성공 시에만)**
 *
 *       <details>
 *       <summary>⚙️ 처리 순서 (클릭하여 펼치기)</summary>
 *
 *       ```
 *       1. 토큰 잔액 확인 (부족 시 403 반환)
 *       2. 사용자 조회
 *       3. DB INSERT (status='pending')
 *       4. AI 분석 수행
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
 *       **계절 필터링**: 현재 계절에 맞는 꽃만 추천
 *       </details>
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
 *                 description: 분석할 감정/상황 텍스트
 *                 example: "요즘 많이 지쳐있어서 위로받고 싶어요"
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
 *                 recommendation_id:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *                 total_count:
 *                   type: integer
 *                   description: "검색된 꽃의 총 개수 (최대 10개)"
 *                 title:
 *                   type: string
 *                   description: "추천 제목 (AI 생성 또는 자동 생성)"
 *                 message:
 *                   type: string
 *                   description: "추천 메시지 (AI 생성, Preset은 빈 문자열)"
 *                 recipient:
 *                   type: string
 *                   nullable: true
 *                   description: "받는 사람 (AI 추출 또는 Label)"
 *                 occasion:
 *                   type: string
 *                   nullable: true
 *                   description: "상황 (AI 추출 또는 Label)"
 *                 recommendations:
 *                   type: array
 *             example:
 *               success: true
 *               recommendation_id: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *               total_count: 2
 *               recommendations:
 *                 - flower_id: 12
 *                   flower_meaning_id: 24
 *                   flower_name: "안개꽃"
 *                   meaning: "맑은 마음"
 *                   color: "하양"
 *                   score: 26
 *                   image_url: "gypsophila.jpg"
 *                 - flower_id: 5
 *                   flower_meaning_id: 10
 *                   flower_name: "프리지아"
 *                   meaning: "당신의 시작을 응원해"
 *                   color: "노랑"
 *                   score: 18
 *                   image_url: "freesia.jpg"
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요 (로그인 필수)
 *       403:
 *         description: 토큰 부족 (AI 추천 토큰 필요)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "사용 가능한 토큰 부족"
 *       500:
 *         description: 서버 오류
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
      const standardizedRecommendations = recommendations.map(rec => ({
        flower_id: rec.flower.id,
        flower_meaning_id: rec.flowerMeaningId || 0,
        flower_name: rec.flower.name_ko,
        meaning: rec.flower.flower_meanings?.find(m => m.id === rec.flowerMeaningId)?.meaning || '',
        color: rec.flower.flower_meanings?.find(m => m.id === rec.flowerMeaningId)?.color || '',
        score: rec.score,
        image_url: rec.flower.image_url || null,
      }));

      return NextResponse.json({
        success: true,
        recommendation_id: recommendationId,
        total_count: standardizedRecommendations.length,
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
