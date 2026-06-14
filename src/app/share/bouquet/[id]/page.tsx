import { notFound } from 'next/navigation';
import PageScroll from '@/app/_ui/page-scroll';
import { createClient } from '@shared/supabase/server';
import { formatBouquetRecipeDetail } from '@/app/api/recipe/bouquet/helper';
import { generateMessageSignature } from '@/shared/utils/signature';
import ShareBouquetContent from './_ui/share-bouquet-content';

type TProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sig?: string }>;
};

export default async function SharedBouquetPage({ params, searchParams }: TProps) {
  const { id } = await params;
  const { sig } = await searchParams;

  const supabase = await createClient();

  // 1. RLS 정책 상 is_public = true 이거나 소유자(본인 로그인 시)인 경우에만 성공적으로 조회됩니다.
  const { data: bouquet, error } = await supabase
    .from('bouquet_recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !bouquet) {
    if (error?.code === 'PGRST116') {
      return notFound();
    }
    console.error('Shared bouquet detail query error:', error);
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
        <p className='text-body-md text-gray-400'>꽃다발을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  // 2. 공통 포맷터로 데이터 가공
  const formattedData = await formatBouquetRecipeDetail(supabase, bouquet);

  // 3. 서명 검증하여 카드 메시지 노출 분기 처리
  const messageSignature = generateMessageSignature(id);
  const signatureValid = sig === messageSignature;

  if (!signatureValid) {
    formattedData.message = null; // 서명이 없거나 유효하지 않으면 메시지를 숨김
  }

  return (
    <PageScroll>
      <ShareBouquetContent data={formattedData} sig={sig || ''} />
    </PageScroll>
  );
}
