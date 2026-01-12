import { tempFlowerDetailData } from './_datas';
import FlowerDescContainer from './_ui/flower-desc-container';
import FlowerImagesContainer from './_ui/flower-images-container';
import FlowerSimilarContainer from './_ui/flower-similar-container';
import FlowerTabContainer from './_ui/flower-tab-container';

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
      <FlowerTabContainer {...tempFlowerDetailData}/>
      <div className='w-full h-micro bg-gray-100' />
      <FlowerSimilarContainer {...tempFlowerDetailData}/>
    </div>
  );
};

export default FlowerDetailPage;
