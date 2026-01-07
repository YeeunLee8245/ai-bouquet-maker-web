import { tempFlowerDetailData } from './_datas';
import FlowerDescContainer from './_ui/FlowerDescContainer';
import FlowerImagesContainer from './_ui/FlowerImagesContainer';

/**
 * 꽃 사전 상세 페이지
 */
function FlowerDetailPage() {
  const { images } = tempFlowerDetailData;
  return (
    <div className="relative flex-1 overflow-y-auto">
      <FlowerImagesContainer
        {...tempFlowerDetailData}
      />
      <FlowerDescContainer
        {...tempFlowerDetailData}
      />
      Flower Detail Page
    </div>
  );
};

export default FlowerDetailPage;
