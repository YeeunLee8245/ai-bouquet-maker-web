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
        { name: 'Recommend', description: '꽃 추천 API' },
      ],
      components: {
        schemas: {
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
