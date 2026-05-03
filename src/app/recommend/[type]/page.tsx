import PageScroll from '@/widgets/footer/page-scroll';

/**
 * 맞춤 추천 페이지
 */
const RecommendPage = ({ params }: { params: { type: string } }) => {
  return (
    <PageScroll>
      <div>Recommend Page {params.type}</div>
    </PageScroll>
  );
};

export default RecommendPage;
