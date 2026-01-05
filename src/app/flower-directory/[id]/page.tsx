import { testDirectoryItem } from '../_datas';
import FlowerImagesContainer from './_ui/FlowerImagesContainer';

/**
 * 꽃 사전 상세 페이지
 */
const FlowerDetailPage = () => {
  return (
    <div className="relative flex-1 overflow-y-auto">
      <FlowerImagesContainer
        {...testDirectoryItem}
      />
      Flower Detail Page
    </div>
  );
};

export default FlowerDetailPage;
