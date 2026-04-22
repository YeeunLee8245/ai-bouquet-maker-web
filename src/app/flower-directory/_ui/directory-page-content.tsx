'use client';

import { Suspense, useMemo } from 'react';
import { IDirectoryEventHub } from '../_types';
import DirectoryFilterToggle from './directory-filter-toggle';
import DirectoryFilterContainer from './directory-filter-container';
import DirectorySearchInput from './directory-search-input';
import DirectoryFilterKeywordContainer from './directory-filter-keyword-container';
import DirectoryListContainer from './directory-list-container';
import DirectoryListSkeleton from './directory-list-skeleton';
import { ScrollToTopButton } from '@/shared/ui/scroll-to-top/scroll-to-top-button';
import ArrowUpIcon from '@/shared/assets/icons/up_arrow.svg';

export default function DirectoryPageContent() {
  const eventHub = useMemo<IDirectoryEventHub>(() => ({
    onToggleFilterSection: undefined,
    onClickColorFilter: undefined,
    onClickSeasonFilter: undefined,
    onClickResetFilter: undefined,
    onSearchKeyword: undefined,
  }), []);

  return (
    <div className='flex-1 px-4 overflow-y-scroll'>
      <div className='py-4 flex justify-between items-center'>
        <span className='text-title-lg'>꽃 사전</span>
        <DirectoryFilterToggle eventHub={eventHub} />
      </div>
      <DirectoryFilterContainer eventHub={eventHub} />
      <DirectorySearchInput eventHub={eventHub} />
      <DirectoryFilterKeywordContainer eventHub={eventHub} />
      <Suspense fallback={<DirectoryListSkeleton />}>
        <DirectoryListContainer eventHub={eventHub} />
      </Suspense>
      <ScrollToTopButton className='bottom-[20px]'>
        <ArrowUpIcon className='w-[14px] h-[15px] text-white'/>
      </ScrollToTopButton>
    </div>
  );
}
