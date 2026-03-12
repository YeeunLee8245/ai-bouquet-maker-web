'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import BouquetListItem from './_ui/bouquet-list-item';

// yeeun: TEMP 데이터
const TEMP_BOUQUETS = [
  {
    id: '1',
    name: '꽃다발 이름',
    occasion: '상황',
    recipient: '대상',
    message: '제출된 내용',
    flowers: [
      { id: 'f1', name: '꽃명', colorAndQuantities: [{ color: '#BDBDBD', quantity: 0 }, { color: '#BDBDBD', quantity: 0 }] },
      { id: 'f2', name: '꽃명', colorAndQuantities: [{ color: '#BDBDBD', quantity: 0 }, { color: '#BDBDBD', quantity: 0 }] },
      { id: 'f3', name: '꽃명', colorAndQuantities: [{ color: '#BDBDBD', quantity: 0 }, { color: '#BDBDBD', quantity: 0 }] },
    ],
    createdAt: '2025년 12월 06일',
  },
];

/**
 * 내 꽃다발 목록 페이지
 */
const MyBouquetPage = () => {
  const [bouquets, setBouquets] = useState(TEMP_BOUQUETS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allIds = bouquets.map((b) => b.id);
  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : allIds);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = () => {
    // TODO: API 연동
    setBouquets((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
    setSelectedIds([]);
  };

  const handleDeleteOne = (id: string) => {
    // TODO: API 연동
    setBouquets((prev) => prev.filter((b) => b.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 헤더 */}
      <div className='px-4 pt-4 pb-2 flex items-center justify-between'>
        <p className='text-title-lg'>내 꽃다발</p>
        <Button size='sm' asChild>
          <Link href='/make-bouquet'>+ 새 꽃다발 만들기</Link>
        </Button>
      </div>

      {/* 선택 삭제 바 */}
      <div className='px-4 py-2 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleSelectAll}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              isAllSelected ? 'bg-primary-400 border-primary-400' : 'bg-white border-gray-200'
            }`}
          >
            {isAllSelected && (
              <svg width='10' height='8' viewBox='0 0 10 8' fill='none'>
                <path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            )}
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className='text-body-sm text-gray-400 disabled:opacity-40'
          >
            선택 삭제
          </button>
        </div>
        <button
          onClick={() => setSelectedIds([])}
          className='text-body-sm text-gray-700'
        >
          완료
        </button>
      </div>

      {/* 목록 */}
      <div className='flex flex-col gap-4 px-4 pb-6'>
        {bouquets.map((bouquet) => (
          <BouquetListItem
            key={bouquet.id}
            bouquet={bouquet}
            isSelected={selectedIds.includes(bouquet.id)}
            onSelect={() => handleToggleSelect(bouquet.id)}
            onDelete={handleDeleteOne}
          />
        ))}
        {bouquets.length === 0 && (
          <div className='flex flex-col items-center justify-center py-20 gap-2'>
            <p className='text-body-md text-gray-400'>저장된 꽃다발이 없어요</p>
            <Button size='sm' asChild>
              <Link href='/make-bouquet'>+ 새 꽃다발 만들기</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBouquetPage;
