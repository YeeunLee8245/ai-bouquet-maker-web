import { relationshipTemplates } from '@/lib/recommend/relationship-templates';
import { createClient } from '@/shared/supabase/server';

type FlowerMeaningRow = {
  meaning: string | null;
  is_primary: boolean | null;
};

type MainFlowerRow = {
  id: number;
  name_ko: string;
  image_url: string | null;
  flower_meanings: FlowerMeaningRow[] | null;
};

export async function getMainData() {
  const supabase = await createClient();

  // 1. 빠른 대상 추천 리스트 가공
  const recipients = relationshipTemplates.map((template) => ({
    id: template.relationship,
    label: template.label,
  }));

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const currentMonth = now.getMonth() + 1;

  // 현재 계절 계산
  let currentSeason = '';
  if (currentMonth >= 3 && currentMonth <= 5) {
    currentSeason = '봄';
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    currentSeason = '여름';
  } else if (currentMonth >= 9 && currentMonth <= 11) {
    currentSeason = '가을';
  } else {
    currentSeason = '겨울';
  }

  // 2. 인기 꽃 추천 (최근 1일 좋아요 기반)
  // 조인을 통해 좋아요 수와 꽃 정보를 함께 가져오기 위해 RPC 또는 복합 쿼리 사용 가능하지만,
  // 여기서는 간단하게 user_flower_likes에서 flower_id를 집계합니다.
  const { data: popularLikes } = await supabase
    .from('user_flower_likes')
    .select('flower_id')
    .gt('created_at', oneDayAgo);

  const counts1d: Record<number, number> = {};
  popularLikes?.forEach((like) => {
    counts1d[like.flower_id] = (counts1d[like.flower_id] || 0) + 1;
  });

  // 좋아요가 있는 꽃 아이디들
  const popularFlowerIds = Object.keys(counts1d).map(Number);
  const flowerSelect = 'id, name_ko, image_url, flower_meanings(meaning, is_primary)';

  let popularFlowersQuery = supabase.from('flowers').select(flowerSelect);

  if (popularFlowerIds.length > 0) {
    // 좋아요가 있는 꽃들을 우선 조회
    popularFlowersQuery = popularFlowersQuery.in('id', popularFlowerIds);
  }

  const { data: popularFlowersData } = await popularFlowersQuery.limit(50);
  let popularFlowers = ((popularFlowersData ?? []) as MainFlowerRow[]);

  // 만약 10개보다 적다면 부족한 만큼만 전체에서 랜덤하게 채움
  if (popularFlowers.length < 10) {
    const needed = 10 - popularFlowers.length;
    const existingIds = popularFlowers.map((f) => f.id);

    let extraQuery = supabase.from('flowers').select(flowerSelect);

    if (existingIds.length > 0) {
      extraQuery = extraQuery.not('id', 'in', `(${existingIds.join(',')})`);
    }

    const { data: extraFlowers } = await extraQuery.limit(needed + 5);
    const randomExtras = ((extraFlowers ?? []) as MainFlowerRow[])
      .sort(() => 0.5 - Math.random())
      .slice(0, needed);

    popularFlowers = [...popularFlowers, ...randomExtras];
  }

  // 랜덤으로 10개 섞기
  const shuffledPopular = popularFlowers
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  // 3. 오늘의 꽃 추천 (계절 + 1주일 좋아요 1위 기반)
  // 1주일간 좋아요 집계
  const { data: weekLikes } = await supabase
    .from('user_flower_likes')
    .select('flower_id')
    .gt('created_at', oneWeekAgo);

  const counts1w: Record<number, number> = {};
  weekLikes?.forEach((like) => {
    counts1w[like.flower_id] = (counts1w[like.flower_id] || 0) + 1;
  });

  const topFlowerId = Number(
    Object.entries(counts1w)
      .sort(([, a], [, b]) => b - a)[0]?.[0],
  );

  // 계절에 맞는 꽃들 조회
  const { data: seasonalFlowers } = await supabase
    .from('flowers')
    .select(`
      id, name_ko, image_url,
      flower_meanings(meaning, is_primary)
    `)
    .or(`seasons.cs.{${currentSeason}}, and(blooming_start_month.lte.${currentMonth}, blooming_end_month.gte.${currentMonth})`);

  const seasonalFlowerRows = (seasonalFlowers ?? []) as MainFlowerRow[];

  let todaysFlowerCandidate: MainFlowerRow | null = null;

  // 1위 꽃이 계절에 맞는지 확인
  if (Number.isFinite(topFlowerId)) {
    todaysFlowerCandidate = seasonalFlowerRows.find((f) => f.id === topFlowerId) ?? null;
  }

  // 후보가 없으면 계절 꽃 중 랜덤, 계절 꽃도 없으면 전체 중 랜덤
  if (!todaysFlowerCandidate) {
    if (seasonalFlowerRows.length > 0) {
      todaysFlowerCandidate = seasonalFlowerRows[Math.floor(Math.random() * seasonalFlowerRows.length)];
    } else {
      const { data: anyFlower } = await supabase
        .from('flowers')
        .select(`
          id, name_ko, image_url,
          flower_meanings(meaning, is_primary)
        `)
        .limit(1)
        .single();

      todaysFlowerCandidate = (anyFlower as MainFlowerRow | null) ?? null;
    }
  }

  // 4. 데이터 가공 (대표 의미 추출)
  const getRepresentativeMeanings = (flower: MainFlowerRow) => {
    const meanings = flower.flower_meanings ?? [];
    const primaryMeanings = meanings
      .filter((m) => m.is_primary && m.meaning)
      .map((m) => m.meaning as string);

    if (primaryMeanings.length > 0) {
      return primaryMeanings.slice(0, 2);
    }

    return meanings
      .filter((m) => !!m.meaning)
      .map((m) => m.meaning as string)
      .slice(0, 2);
  };

  const processedPopular = shuffledPopular.map((f) => ({
    id: f.id,
    name_ko: f.name_ko,
    image_url: f.image_url ?? '/temp_geobera.png',
    representative_meanings: getRepresentativeMeanings(f),
  }));

  const processedTodaysFlower = todaysFlowerCandidate
    ? {
      id: todaysFlowerCandidate.id,
      name_ko: todaysFlowerCandidate.name_ko,
      image_url: todaysFlowerCandidate.image_url ?? '/temp_geobera.png',
      representative_meanings: getRepresentativeMeanings(todaysFlowerCandidate),
    }
    : null;

  return {
    recipients,
    popularFlowers: processedPopular,
    todaysFlower: processedTodaysFlower,
  };
}
