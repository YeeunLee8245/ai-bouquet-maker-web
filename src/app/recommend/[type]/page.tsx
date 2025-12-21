/**
 * 맞춤 추천 페이지
 */
const RecommendPage = ({ params }: { params: { type: string } }) => {
  return (
    <div>Recommend Page {params.type}</div>
  );
};

export default RecommendPage;
