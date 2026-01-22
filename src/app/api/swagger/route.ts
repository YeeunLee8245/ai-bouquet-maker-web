import { NextResponse } from 'next/server';
import { createSwaggerSpec } from 'next-swagger-doc';

export const GET = async () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'AI Bouquet Maker API',
        version: '1.0.0',
        description: '꽃말 기반 AI 꽃 추천 서비스 API',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Development' },
      ],
      tags: [
        { name: 'Auth', description: '인증 및 사용자 관리 API (Google, Kakao OAuth 지원)' },
        { name: 'Recommend', description: '꽃 추천 API' },
        { name: 'Flowers', description: '꽃 사전 및 좋아요 API' },
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
            },
          },
          RecipientAnalysisResponse: {
            allOf: [
              { $ref: '#/components/schemas/EmotionAnalysisResponse' },
              {
                type: 'object',
                properties: {
                  recipient: { type: 'string', example: '엄마' },
                },
              },
            ],
          },
        },
      },
    },
    apiFolder: 'src/app/api',
  });

  return NextResponse.json(spec);
};
