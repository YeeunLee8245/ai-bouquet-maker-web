'use client';

import { SearchInput } from '@/shared/ui/input';
import { useState, useEffect } from 'react';
import { ColorChipGroup } from '@/shared/ui/chip';
import { cn } from '@/shared/utils/styles';
import { useDebounceValue } from '@/shared/hooks/useDebounceValue';

type TFlowerSearchResult = {
  id: string;
  name: string;
  colors: string[];
};

type TProps = {
  selectedIds: string[];
  onToggle: (flower: { id: string; name: string }) => void;
};

function FlowerSearchSection({ selectedIds, onToggle }: TProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<TFlowerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounceValue(search, 300);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/flowers/dictionary?search=${encodeURIComponent(debouncedSearch.trim())}&limit=20`,
        );
        const data = await res.json();
        if (data.success) {
          setResults(
            data.data.flowers.map((f: { id: string; name: string; colors: string[] }) => ({
              id: f.id,
              name: f.name,
              colors: f.colors,
            })),
          );
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  return (
    <section>
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='꽃 이름, 꽃말, 설명 등으로 검색'
        className='w-full h-[40px]'
      />
      {(results.length > 0 || isLoading) && (
        <div className='mt-2 rounded-5 border-1 border-gray-100 min-h-[172px] max-h-[172px] overflow-y-scroll'>
          {isLoading && results.length === 0 && (
            <div className='flex items-center justify-center h-[172px]'>
              <span className='text-body-md text-gray-400'>검색 중...</span>
            </div>
          )}
          {results.map(({ id, name, colors }) => {
            const isSelected = selectedIds.includes(id);
            return (
              <div
                key={id}
                onClick={() => onToggle({ id, name })}
                className={cn(
                  'px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors',
                  isSelected && 'bg-primary-50',
                )}
              >
                <div>
                  <span className='text-body-lg'>{name}</span>
                </div>
                <ColorChipGroup colors={colors} />
              </div>
            );
          })}
        </div>
      )}
      {debouncedSearch.trim() && !isLoading && results.length === 0 && (
        <div className='mt-2 rounded-5 border-1 border-gray-100 min-h-[172px] flex items-center justify-center'>
          <span className='text-body-md text-gray-400'>검색 결과가 없습니다.</span>
        </div>
      )}
    </section>
  );
}

export default FlowerSearchSection;
