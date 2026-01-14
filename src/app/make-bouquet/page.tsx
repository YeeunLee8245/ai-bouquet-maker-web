import React from 'react';
import MakeBouquetButton from './_ui/make-bouquet-button';
import MakeBouquetInfoContainer from './_ui/make-bouquet-info-container';
import MakeBouquetCompositionContainer from './_ui/make-bouquet-composition-container';
import MakeBouquetPackagingContainer from './_ui/make-bouquet-packaging-container';
import MakeBouquetSummaryContainer from './_ui/make-bouquet-summary-containert';
import MakeBouquetPreviewContainer from './_ui/make-bouquet-preview-container';

/**
 * 꽃다발 만들기 페이지
 */
const MakeBouquetPage = () => {
  return (
    <div>
      <div className='pt-4 pb-2 mx-4 px-1'>
        <p className="text-title-lg">꽃다발 만들기</p>
        <p className="mt-1 text-body-md text-gray-400 whitespace-pre-wrap">{'특별한 마음을 담은 꽃다발을 직접\n구성해 보세요.'}</p>
      </div>
      <div className='pt-4 pb-8 px-4'>
        <MakeBouquetInfoContainer />
        <MakeBouquetCompositionContainer />
        <MakeBouquetPackagingContainer />
        <MakeBouquetSummaryContainer />
        <MakeBouquetPreviewContainer />
        <MakeBouquetButton />
      </div>
    </div>
  );
};

export default MakeBouquetPage;
