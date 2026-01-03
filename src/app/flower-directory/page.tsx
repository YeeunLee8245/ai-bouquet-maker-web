'use client';

import DirectoryTopSection from './_ui/directory-top-section';
import { IDirectoryEventHub } from './_types';
import DirectoryFilterToggle from './_ui/DirectoryFilterToggle';
import DirectoryFilterContainer from './_ui/DirectoryFilterContainer';
import DirectorySearchInput from './_ui/DirectorySearchInput';
import DirectoryFilterKeywordContainer from './_ui/DirectoryFilterKeywordContainer';
import { useMemo } from 'react';

/**
 * 꽃 사전 리스트 페이지
 */
const FlowerDirectoryPage = () => {
  const eventHub = useMemo<IDirectoryEventHub>(() => ({
    onToggleFilterSection: undefined,
    onClickColorFilter: undefined,
    onClickSeasonFilter: undefined,
    onSearchKeyword: undefined,
  }), []);

  return (
    <div className="px-4">
      <div className='py-4 flex justify-between items-center'>
        <span className='text-title-lg'>꽃 사전</span>
        <DirectoryFilterToggle eventHub={eventHub} />
      </div>
      <DirectoryFilterContainer eventHub={eventHub} />
      <DirectorySearchInput eventHub={eventHub} />
      <DirectoryFilterKeywordContainer eventHub={eventHub} />
      <DirectoryTopSection />
      Flower Directory Page
    </div>
  );
};

export default FlowerDirectoryPage;
