import { NextResponse } from 'next/server';
import { createSwaggerSpec } from 'next-swagger-doc';

export const GET = async () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'AI Bouquet Maker API',
        version: '1.0.0',
        description: `
꽃말 기반 AI 꽃 추천 서비스 **AI Bouquet Maker**의 API 문서입니다.

### 서비스 핵심 워크플로우 (Service Flows)
<details>
<summary><b>1. AI 기반 맞춤 추천 및 제작 플로우 (Main Flow)</b></summary>

1.  **- 1. 분석 요청**: 사용자가 감정이나 대상을 묘사한 텍스트를 전송합니다. (\`POST /api/recommend/ai/...\`)
    - *내부 로직*: 토큰 잔액 확인 → AI 분석 시작 → 추천 순위 산정(태그+AI가점+계절필터) → **토큰 1개 차감**.
2.  **- 2. 꽃 선택**: 추천된 꽃 목록 중 사용자가 꽃다발에 담을 꽃을 선택합니다. (\`POST /api/recommend/user-selection\`)
3.  **- 3. 상세 편집**: 선택된 꽃들을 기반으로 캔버스 에디터에서 배치(좌표), 수량, 커스텀 색상을 설정합니다.
4.  **- 4. 레시피 저장**: 최종 완성된 꽃다발 형태를 저장합니다. (\`POST /api/recipe/bouquet\`)
    - *활용*: 저장된 레시피 ID를 통해 언제든 미리보기 이미지 생성 및 수정이 가능합니다.
</details>

<br />
<details>
<summary><b>2. 토큰 획득 및 사용 경제 플로우 (Economy Flow)</b></summary>

-   **- 1. 적립**: 사용자가 로그인 시 \`daily_login\` 기록을 통해 자동 토큰이 충전됩니다. (\`GET /api/main\` 호출 시 내부 처리)
-   **- 2. 소모**: 오직 **AI 분석 기능** 사용 시에만 토큰이 소모됩니다. (일반 프리셋 추천은 무료)
-   **- 3. 추적**: 모든 지갑 활동은 실시간 히스토리로 기록되어 사용자가 직접 확인할 수 있습니다. (\`GET /api/wallet/history\`)
</details>

<br />
<details>
<summary><b>3. 꽃 사전 탐색 및 관심 등록 플로우 (Discovery Flow)</b></summary>

-   **- 1. 검색**: 이름, 색상, 계절별 필터를 통해 꽃 정보를 탐색합니다. (\`GET /api/flowers/dictionary\`)
-   **- 2. 관심 등록**: 마음에 드는 꽃에 '좋아요'를 표시합니다. (\`POST /api/flowers/{id}/like\`)
-   **- 3. 개인화**: 좋아요 데이터는 마이페이지 통계 및 홈 화면 추천 데이터로 활용됩니다.
</details>

---
        `,
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Development' },
      ],
      tags: [
        { name: 'Auth', description: '인증 및 사용자 관리 API (Google, Kakao OAuth 지원)' },
        { name: 'Recommend', description: '꽃 추천 API' },
        { name: 'Flowers', description: '꽃 사전 및 좋아요 API' },
        { name: 'Recipe', description: '꽃다발 레시피 관리 API' },
        { name: 'Wallet', description: '지갑 및 토큰 API' },
      ],
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'uuid-string' },
              email: { type: 'string', example: 'user@example.com' },
              nickname: { type: 'string', example: '꽃돌이' },
              bio: { type: 'string', nullable: true, example: '꽃을 사랑하는 사람입니다.', description: '자기소개' },
              avatar_url: { type: 'string', example: 'https://example.com/avatar.png' },
              is_onboarded: { type: 'boolean', example: false, description: '온보딩 완료 여부' },
              created_at: { type: 'string', format: 'date-time' },
            },
          },
          WalletBalance: {
            type: 'object',
            properties: {
              balance: { type: 'integer', example: 150, description: '현재 보유 토큰 잔액' },
            },
          },
          WalletLedger: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              source: {
                type: 'string',
                enum: ['signup', 'daily_login', 'topup', 'admin', 'event'],
                example: 'daily_login',
              },
              type: {
                type: 'string',
                enum: ['credit', 'debit', 'refund', 'expire'],
                example: 'credit',
              },
              amount: { type: 'integer', example: 10 },
              balance_after: { type: 'integer', example: 150 },
              reference_type: { type: 'string', example: 'recommendation' },
              reference_id: { type: 'string', example: 'uuid-string' },
              reference_id_type: { type: 'string', enum: ['uuid', 'int', 'composite'], example: 'uuid' },
              description: { type: 'string', example: '일일 로그인 보너스' },
              created_at: { type: 'string', format: 'date-time' },
            },
          },
          AnalysisTags: {
            type: 'object',
            properties: {
              emotion_tags: { type: 'array', items: { type: 'string' }, example: ['축하', '감사'] },
              situation_tags: { type: 'array', items: { type: 'string' }, example: ['생일'] },
              relation_tags: { type: 'array', items: { type: 'string' }, example: ['친구'] },
              style_tags: { type: 'array', items: { type: 'string' }, example: ['화려한'] },
            },
          },
          RecommendFlower: {
            type: 'object',
            properties: {
              flower_name: { type: 'string', example: '장미' },
              color: { type: 'string', example: '빨강' },
              reason: { type: 'string', example: '사랑을 전하는 꽃입니다.' },
            },
          },
          EmotionAnalysisResponse: {
            type: 'object',
            properties: {
              title: { type: 'string', example: '생일 축하 꽃다발' },
              tags: { $ref: '#/components/schemas/AnalysisTags' },
              recommend_flowers: { type: 'array', items: { $ref: '#/components/schemas/RecommendFlower' } },
              message: { type: 'string', example: '생일 축하해! 항상 행복하길 바라.' },
              occasion: { type: 'string', example: '생일 축하' },
            },
          },
          RecipientAnalysisResponse: {
            allOf: [
              { $ref: '#/components/schemas/EmotionAnalysisResponse' },
              {
                type: 'object',
                properties: {
                  recipient: { type: 'string', example: '엄마' },
                  occasion: { type: 'string', example: '부모님 생신' },
                },
              },
            ],
          },
          BouquetFlowerItem: {
            type: 'object',
            description: '꽃다발에 포함된 꽃 정보',
            required: ['flower_id', 'flower_name', 'quantity'],
            properties: {
              flower_id: { type: 'string', example: '1', description: '꽃 기본 ID (flowers 테이블)' },
              flower_name: { type: 'string', example: '장미', description: '꽃 한글 이름' },
              quantity: { type: 'integer', example: 3, description: '포함된 수량' },
              color: { type: 'string', nullable: true, example: '#FF0000', description: '사용자가 선택한 렌더링용 색상 (Hex)' },
              image_url: { type: 'string', nullable: true, example: 'https://example.com/flower.png', description: '꽃 이미지 URL' },
              flower_meaning_id: { type: 'string', nullable: true, example: '1', description: '선택한 꽃말 ID (flower_meanings 테이블)' },
              meaning: { type: 'string', nullable: true, example: '열정적인 사랑', description: '해당 꽃말의 상징 텍스트' },
              icon_color: { type: 'string', nullable: true, example: '#E31C25', description: 'DB에 정의된 꽃말 상징색 (아이콘용)' },
            },
          },
          BouquetRecipeDetail: {
            allOf: [
              { $ref: '#/components/schemas/BouquetRecipeListItem' },
              {
                type: 'object',
                properties: {
                  wrapping: {
                    type: 'object',
                    properties: {
                      ribbonColor: { type: 'string', nullable: true, example: '#FF0000', description: '리본 색상' },
                      wrappingColor: { type: 'string', nullable: true, example: '#FFFFFF', description: '포장지 색상' },
                    },
                  },
                  layout: {
                    type: 'object',
                    nullable: true,
                    description: '꽃다발 미리보기 레이아웃 정보 (좌표 등)',
                    additionalProperties: true,
                  },
                },
              },
            ],
          },
          BouquetRecipeListItem: {
            type: 'object',
            description: '꽃다발 레시피 목록 아이템',
            required: ['id', 'name', 'flowers', 'created_at'],
            properties: {
              id: { type: 'string', format: 'uuid', description: '꽃다발 레시피 ID' },
              name: { type: 'string', example: '생일 축하 꽃다발', description: '꽃다발 이름' },
              occasion: { type: 'string', nullable: true, example: '생일', description: '상황' },
              recipient: { type: 'string', nullable: true, example: '어머니', description: '받는 사람 (대상)' },
              message: { type: 'string', nullable: true, example: '항상 건강하세요!', description: '전달 메시지' },
              flowers: {
                type: 'array',
                description: '담은 꽃 목록',
                items: { $ref: '#/components/schemas/BouquetFlowerItem' },
              },
              created_at: { type: 'string', format: 'date-time', description: '생성일' },
              updated_at: { type: 'string', format: 'date-time', nullable: true, description: '수정일' },
            },
          },
        },
      },
    },
    apiFolder: 'src/app/api',
  });

  return NextResponse.json(spec);
};
