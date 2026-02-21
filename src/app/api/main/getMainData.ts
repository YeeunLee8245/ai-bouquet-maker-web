import { relationshipTemplates } from '@/lib/recommend/relationship-templates';
import { createClient } from '@/shared/supabase/server';

type MainFlowerRow = {
  id: number;
  name_ko: string;
  image_url: string | null;
  representative_meanings_tags: string[] | null;
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
  const { data: popularLikes } = await supabase
    .from('user_flower_likes')
    .select('flower_id')
    .gt('created_at', oneDayAgo);

  const counts1d: Record<number, number> = {};
  popularLikes?.forEach((like) => {
    counts1d[like.flower_id] = (counts1d[like.flower_id] || 0) + 1;
  });

  const popularFlowerIds = Object.keys(counts1d).map(Number);
  const flowerSelect = 'id, name_ko, image_url, representative_meanings_tags';

  let popularFlowersQuery = supabase.from('flowers').select(flowerSelect);

  if (popularFlowerIds.length > 0) {
    popularFlowersQuery = popularFlowersQuery.in('id', popularFlowerIds);
  }

  const { data: popularFlowersData } = await popularFlowersQuery.limit(50);
  let popularFlowers = ((popularFlowersData ?? []) as MainFlowerRow[]);

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

  const shuffledPopular = popularFlowers
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  // 3. 오늘의 꽃 추천 (계절 + 1주일 좋아요 1위 기반)
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

  const { data: seasonalFlowers } = await supabase
    .from('flowers')
    .select(flowerSelect)
    .or(`seasons.cs.{${currentSeason}}, and(blooming_start_month.lte.${currentMonth}, blooming_end_month.gte.${currentMonth})`);

  const seasonalFlowerRows = (seasonalFlowers ?? []) as MainFlowerRow[];

  let todaysFlowerCandidate: MainFlowerRow | null = null;

  if (Number.isFinite(topFlowerId)) {
    todaysFlowerCandidate = seasonalFlowerRows.find((f) => f.id === topFlowerId) ?? null;
  }

  if (!todaysFlowerCandidate) {
    if (seasonalFlowerRows.length > 0) {
      todaysFlowerCandidate = seasonalFlowerRows[Math.floor(Math.random() * seasonalFlowerRows.length)];
    } else {
      const { data: anyFlower } = await supabase
        .from('flowers')
        .select(flowerSelect)
        .limit(1)
        .single();

      todaysFlowerCandidate = (anyFlower as MainFlowerRow | null) ?? null;
    }
  }

  // 4. 데이터 가공 (대표 의미 직접 추출)
  const processedPopular = shuffledPopular.map((f) => ({
    id: f.id,
    name_ko: f.name_ko,
    image_url: f.image_url ?? '/temp_geobera.png',
    representative_meanings: f.representative_meanings_tags?.slice(0, 3) ?? [],
  }));

  const processedTodaysFlower = todaysFlowerCandidate
    ? {
      id: todaysFlowerCandidate.id,
      name_ko: todaysFlowerCandidate.name_ko,
      image_url: todaysFlowerCandidate.image_url ?? '/temp_geobera.png',
      representative_meanings: todaysFlowerCandidate.representative_meanings_tags?.slice(0, 3) ?? [],
    }
    : null;

  return {
    recipients,
    popularFlowers: processedPopular,
    todaysFlower: processedTodaysFlower,
  };
}

