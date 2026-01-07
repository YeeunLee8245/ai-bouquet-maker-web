'use client';

import { IDirectoryEventHub } from './_types';
import DirectoryFilterToggle from './_ui/DirectoryFilterToggle';
import DirectoryFilterContainer from './_ui/DirectoryFilterContainer';
import DirectorySearchInput from './_ui/DirectorySearchInput';
import DirectoryFilterKeywordContainer from './_ui/DirectoryFilterKeywordContainer';
import { useMemo } from 'react';
import DirectoryListContainer from './_ui/DirectoryListContainer';
import { ScrollToTopButton } from '@/shared/ui/scroll-to-top/ScrollToTopButton';
import ArrowUpIcon from '@/shared/assets/icons/up_arrow.svg';

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
    <div className="flex-1 px-4 overflow-y-scroll">
      <div className='py-4 flex justify-between items-center'>
        <span className='text-title-lg'>꽃 사전</span>
        <DirectoryFilterToggle eventHub={eventHub} />
      </div>
      <DirectoryFilterContainer eventHub={eventHub} />
      <DirectorySearchInput eventHub={eventHub} />
      <DirectoryFilterKeywordContainer eventHub={eventHub} />
      <DirectoryListContainer eventHub={eventHub} />
      <ScrollToTopButton className='bottom-[20px]'>
        <ArrowUpIcon className='w-[14px] h-[15px]'/>
      </ScrollToTopButton>
    </div>
  );
};

export default FlowerDirectoryPage;
