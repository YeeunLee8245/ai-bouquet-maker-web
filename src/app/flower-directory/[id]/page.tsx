import { tempFlowerDetailData } from './_datas';
import FlowerDescContainer from './_ui/FlowerDescContainer';
import FlowerImagesContainer from './_ui/FlowerImagesContainer';
import FlowerTabContainer from './_ui/FlowerTabContainer';

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

      Flower Detail Page
    </div>
  );
};

export default FlowerDetailPage;
