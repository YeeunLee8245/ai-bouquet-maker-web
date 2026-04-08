import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/recipe/bouquet:
 *   post:
 *     tags:
 *       - Recipe
 *     summary: 꽃다발 레시피 생성
 *     description: |
 *       사용자가 직접 구성한 꽃다발 레시피를 저장합니다.
 *       AI 추천 결과(recommendation_id)를 기반으로 생성하거나, 처음부터 직접 만들 수 있습니다.
 *       저장 포맷은 `PUT /api/recipe/bouquet/{id}` 요청 포맷과 동일합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드 (v2 - colorInfos 기반)
 *       - **색상 선택 흐름**: `/api/recipe/bouquet/selected`에서 받은 `colorInfos` 배열에서 색상을 선택합니다.
 *       - **`tags` 기준**: `colorInfos.tags`는 `flower_meanings.meaning`을 쉼표(,)로 분리한 값입니다.
 *       - **hex ↔ meaningId 1:1 매핑**: 사용자가 색상(hex)을 선택하면, 해당 colorInfo의 `meaningId`를 `flower_meaning_id`로 저장합니다.
 *       - **`color` (Hex)**: 선택한 색상의 hex 값을 그대로 저장합니다. (렌더링용)
 *       - **`flower_meaning_id`**: 선택한 색상에 매핑된 meaningId를 저장합니다. (`flower_meanings.meaning` 조회용)
 *       - **colorInfos 첫 번째 항목**: is_primary가 true인 기본 색상이 가장 먼저 옵니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - recipe
 *             properties:
 *               name:
 *                 type: string
 *                 description: 꽃다발의 이름 (유저가 입력)
 *                 example: "어머니를 위한 카네이션 꽃다발"
 *               occasion:
 *                 type: string
 *                 description: 선물하는 상황/목적
 *                 example: "어버이날"
 *               recipient:
 *                 type: string
 *                 description: 꽃다발을 받는 사람
 *                 example: "어머니"
 *               message:
 *                 type: string
 *                 description: 함께 전달할 카드 메시지
 *                 example: "항상 사랑하고 감사합니다."
 *               recommendation_id:
 *                 type: string
 *                 format: uuid
 *                 description: 기반이 된 AI 추천 기록 ID (없을 경우 null)
 *                 example: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *               recipe:
 *                 type: object
 *                 description: 꽃다발의 기술적 구성 정보 (`PUT /api/recipe/bouquet/{id}`와 동일한 저장 형식)
 *                 required: [flowers]
 *                 properties:
 *                   flowers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required: [flower_id, flower_meaning_id, quantity, color]
 *                       properties:
 *                         flower_id:
 *                           type: string
 *                           description: 꽃 기본 정보 ID (flowers 테이블)
 *                           example: "1"
 *                         flower_meaning_id:
 *                           type: string
 *                           description: 선택한 구체적인 꽃말/색상 ID (flower_meanings 테이블)
 *                           example: "101"
 *                         quantity:
 *                           type: integer
 *                           description: 해당 꽃의 포함 수량
 *                           example: 3
 *                         color:
 *                           type: string
 *                           description: 선택한 실제 렌더링 색상 (Hex Code)
 *                           example: "#FF8D3E"
 *                   wrapping:
 *                     type: object
 *                     description: 포장지 및 리본 구성 (선택 사항)
 *                     properties:
 *                       ribbonColor:
 *                         type: string
 *                         description: 리본 색상 (Hex Code)
 *                         example: "#FF0000"
 *                       wrappingColor:
 *                         type: string
 *                         description: 포장지 색상 (Hex Code)
 *                         example: "#FFFFFF"
 *               layout:
 *                 type: object
 *                 description: 캔버스 미리보기 배치를 위한 좌표 정보
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       description: 개별 꽃 오브젝트의 위치 및 상태
 *                       properties:
 *                         flower_id: { type: string, description: "꽃 ID" }
 *                         x: { type: number, description: "X 좌표 (px 또는 비율)", example: 150.5 }
 *                         y: { type: number, description: "Y 좌표 (px 또는 비율)", example: 200.0 }
 *                         scale: { type: number, description: "크기 배율", example: 1.2 }
 *                         z_index: { type: integer, description: "레이어 순서", example: 1 }
 *                         color: { type: string, description: "렌더링 색상 (Hex Code)", example: "#FFD700" }
 *                         type: { type: string, description: "아이콘 종류 (예: rose, marigold 등)", example: "rose" }
 *           examples:
 *             general:
 *               summary: 직접 커스텀하여 만들기
 *               description: 유저가 캔버스에서 직접 꽃들을 배치하고 이름을 지어 저장하는 일반적인 상황
 *               value:
 *                 name: "친구 생일 축하 노란 장미 꽃다발"
 *                 occasion: "생일"
 *                 recipient: "친구"
 *                 message: "생일 축하해! 이 꽃처럼 밝은 한 해 되길."
 *                 recipe:
 *                   flowers:
 *                     - flower_id: "112"
 *                       flower_meaning_id: "301"
 *                       quantity: 2
 *                       color: "#FFD700"
 *                   wrapping:
 *                     ribbonColor: "#FFD700"
 *                     wrappingColor: "#F5F5DC"
 *                 layout:
 *                   items:
 *                     - flower_id: "112"
 *                       x: 150
 *                       y: 200
 *                       z_index: 2
 *                       color: "#FFD700"
 *                     - flower_id: "112"
 *                       x: 180
 *                       y: 220
 *                       z_index: 1
 *                       color: "#FFD700"
 *             from_recommendation:
 *               summary: AI 추천 결과 바로 저장
 *               description: AI가 추천해준 조합을 그대로 또는 약간 수정하여 저장하는 상황
 *               value:
 *                 name: "AI가 추천해준 '열정적인 사랑' 꽃다발"
 *                 recommendation_id: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *                 occasion: "프로포즈"
 *                 recipient: "연인"
 *                 recipe:
 *                   flowers:
 *                     - flower_id: "45"
 *                       flower_meaning_id: "204"
 *                       quantity: 9
 *                       color: "#E31C25"
 *                 layout:
 *                   items: []
 *     responses:
 *       201:
 *         description: 꽃다발 레시피 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: 생성된 레시피의 UUID
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *       400:
 *         description: 필수 필드 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string }
 *             examples:
 *               missing_name:
 *                 summary: "이름 누락"
 *                 value: { error: "꽃다발 이름을 입력해주세요." }
 *               missing_recipe:
 *                 summary: "레시피 정보 누락"
 *                 value: { error: "꽃 구성 정보(recipe)가 필요합니다." }
 *       401:
 *         description: 인증 실패 (로그인 필요)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "로그인이 필요한 서비스입니다." }
 *       500:
 *         description: 서버 내부 오류 (DB 저장 실패 등)
 */
export async function POST(request: NextRequest) {
  try {
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      occasion,
      recipient,
      message,
      recipe,
      layout,
      recommendation_id,
    } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('bouquet_recipes')
      .insert({
        user_id: publicUser.id,
        name,
        occasion,
        recipient,
        message,
        recipe,
        layout,
        recommendation_id,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create bouquet recipe:', error);
      return NextResponse.json(
        { error: '레시피 생성에 실패했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating bouquet recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
