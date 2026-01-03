'use client';

import { IDirectoryEventHub } from './_types';
import DirectoryFilterToggle from './_ui/DirectoryFilterToggle';
import DirectoryFilterContainer from './_ui/DirectoryFilterContainer';
import DirectorySearchInput from './_ui/DirectorySearchInput';
import DirectoryFilterKeywordContainer from './_ui/DirectoryFilterKeywordContainer';
import { useMemo } from 'react';
import DirectoryListContainer from './_ui/DirectoryListContainer';

/**
 * 꽃 사전 리스트 페이지
 */
const FlowerDirectoryPage = () => {
  const eventHub = useMemo<IDirectoryEventHub>(() => ({
    onToggleFilterSection: undefined,
    onClickColorFilter: undefined,
    onClickSeasonFilter: undefined,
    onClickResetFilter: undefined,
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
      <DirectoryListContainer eventHub={eventHub} />

    </div>
  );
};

export default FlowerDirectoryPage;
