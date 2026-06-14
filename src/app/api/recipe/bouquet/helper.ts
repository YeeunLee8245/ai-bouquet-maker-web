import { SupabaseClient } from '@supabase/supabase-js';
import { BouquetRecipeContent, BouquetLayout } from '@/types/recommendation';
import type { IBouquetDetailData } from '@/app/my-bouquet/[id]/_types';

const TAG_TOTAL_CHAR_LIMIT = 8;
const TAG_MAX_COUNT = 3;

function normalizeTags(rawTags: string[] | null | undefined): string[] {
  if (!Array.isArray(rawTags)) {
    return [];
  }

  return rawTags
    .map(tag => tag.trim())
    .filter(Boolean);
}

function mergeTagsWithTotalCharLimit(
  emotionTags: string[],
  styleTags: string[],
): string[] {
  const merged = [...new Set([...emotionTags, ...styleTags])];
  const result: string[] = [];
  let totalChars = 0;

  for (const tag of merged) {
    if (result.length >= TAG_MAX_COUNT) {
      break;
    }

    const nextTotal = totalChars + tag.length;
    if (nextTotal > TAG_TOTAL_CHAR_LIMIT) {
      continue;
    }
    result.push(tag);
    totalChars = nextTotal;
  }

  return result;
}

/**
 * Supabase DB에서 가져온 로우 데이터를 클라이언트에 서빙할 포맷으로 변환합니다.
 * 꽃 이름, 꽃말 데이터 조회를 포함하여 처리합니다.
 */
export async function formatBouquetRecipeDetail(
  supabase: SupabaseClient<any>,
  bouquet: any,
): Promise<IBouquetDetailData> {
  const recipe = bouquet.recipe as BouquetRecipeContent | null;
  const flowersInRecipe = recipe?.flowers || [];
  const flowerIds = Array.from(new Set(flowersInRecipe.map(f => f.flower_id)));
  const meaningIds = Array.from(new Set(flowersInRecipe.map(f => f.flower_meaning_id).filter(Boolean)));

  // 꽃 이름 맵 조회
  let flowerMap: Record<string, string> = {};
  if (flowerIds.length > 0) {
    const { data: flowers } = await supabase
      .from('flowers')
      .select('id, name_ko')
      .in('id', flowerIds);

    if (flowers) {
      flowerMap = Object.fromEntries(
        flowers.map(f => [String(f.id), f.name_ko]),
      );
    }
  }

  // 꽃말 맵 조회 (icon_color + meaning + emotion_tags + style_tags)
  let meaningMap: Record<
    string,
    {
      icon_color: string | null;
      meaning: string | null;
      emotion_tags: string[] | null;
      style_tags: string[] | null;
    }
  > = {};
  if (meaningIds.length > 0) {
    const { data: meanings } = await supabase
      .from('flower_meanings')
      .select('id, icon_color, meaning, emotion_tags, style_tags')
      .in('id', meaningIds);

    if (meanings) {
      meaningMap = Object.fromEntries(
        meanings.map(m => [
          String(m.id),
          {
            icon_color: m.icon_color,
            meaning: m.meaning,
            emotion_tags: m.emotion_tags,
            style_tags: m.style_tags,
          },
        ]),
      );
    }
  }

  // 데이터 포맷팅 - flower_id 기준으로 그룹핑
  const flowersGrouped = new Map<string, {
    flower_id: string;
    flower_name: string;
    rawEmotionTags: string[];
    rawStyleTags: string[];
    color_and_quantity: Array<{ color: string; quantity: number; meaningId: string | null }>;
  }>();

  for (const f of flowersInRecipe) {
    const meaningInfo = f.flower_meaning_id ? meaningMap[String(f.flower_meaning_id)] : null;
    const color = f.color || meaningInfo?.icon_color || '#CCCCCC';
    const emotionTags = normalizeTags(meaningInfo?.emotion_tags);
    const styleTags = normalizeTags(meaningInfo?.style_tags);

    if (flowersGrouped.has(f.flower_id)) {
      const existing = flowersGrouped.get(f.flower_id)!;
      existing.color_and_quantity.push({ color, quantity: f.quantity, meaningId: f.flower_meaning_id || null });
      existing.rawEmotionTags.push(...emotionTags);
      existing.rawStyleTags.push(...styleTags);
    } else {
      flowersGrouped.set(f.flower_id, {
        flower_id: f.flower_id,
        flower_name: flowerMap[f.flower_id] || '알 수 없음',
        rawEmotionTags: [...emotionTags],
        rawStyleTags: [...styleTags],
        color_and_quantity: [{ color, quantity: f.quantity, meaningId: f.flower_meaning_id || null }],
      });
    }
  }

  const flowers = Array.from(flowersGrouped.values()).map(f => {
    const { rawEmotionTags, rawStyleTags, ...rest } = f;
    return {
      ...rest,
      tags: mergeTagsWithTotalCharLimit(rawEmotionTags, rawStyleTags),
    };
  });

  return {
    id: bouquet.id,
    name: bouquet.name || '이름 없음',
    occasion: bouquet.occasion || null,
    recipient: bouquet.recipient || null,
    message: bouquet.message || null,
    is_public: bouquet.is_public ?? false,
    created_at: bouquet.created_at,
    updated_at: bouquet.updated_at,
    flowers,
    wrapping: {
      ribbonColor: recipe?.wrapping?.ribbonColor ?? null,
      wrappingColor: recipe?.wrapping?.wrappingColor ?? null,
    },
    layout: bouquet.layout ? {
      items: (bouquet.layout as BouquetLayout).items.map(item => ({
        flower_id: item.flower_id,
        flower_meaning_id: (item as any).flower_meaning_id || '',
        x: item.x,
        y: item.y,
        rotation: (item as any).rotation,
        scale: item.scale,
        z_index: item.z_index,
        color: item.color,
        type: item.type,
      }))
    } : null,
  };
}
