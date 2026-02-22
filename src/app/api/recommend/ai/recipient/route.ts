import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';
import { analyzeRecipient } from '@services/recipient-analysis';
import { getRecommendationsFromAnalysis } from '@/lib/recommend/recommendation';
import { spendToken, getUserBalance } from '@/lib/users/wallet';

/**
 * @swagger
 * /api/recommend/ai/recipient:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: AI 대상 맞춤 꽃 추천
 *     description: |
 *       꽃을 선물받을 대상에 대한 설명을 AI가 분석하여 그들의 취향이나 관계에 가장 어울리는 꽃을 추천합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **분석 범위**: 단순한 '친구', '엄마'라는 단어뿐만 아니라 '평소 차분한 스타일을 좋아하는 30대 여성'과 같은 상세 묘사를 분석합니다.
 *       - **비용**: 요청 성공 시 **토큰 1개**가 소진됩니다.
 *       - **추출 정보**: AI가 입력값에서 `recipient`(대상)와 `occasion`(상황)을 스스로 추출하여 반환합니다. 이 정보는 이후 꽃다발 이름 생성 등에 활용됩니다.
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
 *       | relation_tags 매칭 | **6점** | 관계 태그 매칭 (최우선) |
 *       | style_tags 매칭 | **5점** | 스타일 태그 매칭 |
 *       | emotion_tags 매칭 | **3점** | 감정 태그 매칭 |
 *       | situation_tags 매칭 | **3점** | 상황 태그 매칭 |
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
 *                 description: "선물받을 사람에 대한 설명 (성격, 취향, 나이대, 스타일 등)"
 *                 example: "30대 여자친구인데 평소에 향기에 예민하고 우아한 보라색 스타일을 아주 좋아합니다."
 *     responses:
 *       200:
 *         description: AI 추천 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, recommendation_id, recommendations]
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 recommendation_id: { type: string, format: uuid, description: "생성된 추천 기록 고유 ID" }
 *                 total_count: { type: integer, description: "필터링 후 반환된 꽃의 개수" }
 *                 title: { type: string, description: "AI가 생성한 추천 제목", example: "그녀의 우아함을 닮은 보랏빛 선물" }
 *                 message: { type: string, description: "취향 분석 기반 추천 이유", example: "보라색을 좋아하시는 여자친구분을 위해 고귀함과 신비로움을 상징하는..." }
 *                 recipient: { type: string, nullable: true, description: "AI가 분석한 대상 명칭", example: "30대 여자친구" }
 *                 occasion: { type: string, nullable: true, description: "AI가 분석한 선물 상황", example: "일상의 깜짝 선물" }
 *                 recommendations:
 *                   type: array
 *                   description: "추천된 꽃 목록"
 *                   items:
 *                     type: object
 *                     properties:
 *                       flower_id: { type: integer, example: 15 }
 *                       flower_meaning_id: { type: integer, example: 30 }
 *                       flower_name: { type: string, example: "작약" }
 *                       meaning: { type: string, example: "수줍음" }
 *                       color: { type: string, example: "분홍" }
 *                       score: { type: integer, example: 52 }
 *                       image_url: { type: string, nullable: true, example: "https://.../peony.png" }
 *             examples:
 *               ai_recipient_success:
 *                 summary: "AI 대상 맞춤 분석 성공"
 *                 value:
 *                   success: true
 *                   recommendation_id: "a2b3c4d5-e6f7-8901-abcd-ef1234567890"
 *                   total_count: 3
 *                   title: "그녀의 우아함을 닮은 보랏빛 선물"
 *                   message: "보라색을 좋아하시는 여자친구분을 위해 고귀함과 신비로움을 상징하는 꽃들을 준비했습니다."
 *                   recipient: "30대 여자친구"
 *                   occasion: "일상의 깜짝 선물"
 *                   recommendations:
 *                     - flower_id: 15
 *                       flower_meaning_id: 30
 *                       flower_name: "작약"
 *                       meaning: "수줍음"
 *                       color: "분홍"
 *                       score: 52
 *                       image_url: "https://example.com/flowers/peony.png"
 *               ai_recipient_success_without_target_or_occasion:
 *                 summary: "대상/상황 미추출 시 null 반환 예시"
 *                 value:
 *                   success: true
 *                   recommendation_id: "4e1a1f3d-8608-4658-a2b3-d95b143cff55"
 *                   total_count: 2
 *                   title: "취향을 담은 편안한 꽃 선물"
 *                   message: "명확한 대상이나 상황이 없어도 입력된 취향 정보를 중심으로 추천해드려요."
 *                   recipient: null
 *                   occasion: null
 *                   recommendations:
 *                     - flower_id: 11
 *                       flower_meaning_id: 21
 *                       flower_name: "거베라"
 *                       meaning: "희망"
 *                       color: "오렌지"
 *                       score: 41
 *                       image_url: "https://example.com/flowers/gerbera.png"
 *       400:
 *         description: 입력값 부족
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "선물받을 사람에 대한 설명을 입력해주세요." }
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
 *         description: AI 분석 실패 또는 서버 오류
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
        recommendation_type: 'recipient',
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
      const analysis = await analyzeRecipient(text);

      // 점수 계산 및 꽃 추천
      const { recommendations, ranked } = await getRecommendationsFromAnalysis(analysis, 'recipient');

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
          'AI 대상 맞춤 꽃 추천',
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
        image_url: rec.flower.images?.[0] || null,
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
      console.error('AI Recipient Analysis Error:', aiError);
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
    console.error('AI Recipient Recommend Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
