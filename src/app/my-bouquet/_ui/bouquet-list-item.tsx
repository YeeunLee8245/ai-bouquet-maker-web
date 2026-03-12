'use client';

import Link from 'next/link';

type BouquetFlower = {
  id: string;
  name: string;
  colorAndQuantities: { color: string; quantity: number }[];
};

type Bouquet = {
  id: string;
  name: string;
  occasion: string;
  recipient: string;
  message: string;
  flowers: BouquetFlower[];
  createdAt: string;
};

type Props = {
  bouquet: Bouquet;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
};

export default function BouquetListItem({ bouquet, isSelected, onSelect, onDelete }: Props) {
  return (
    <div className='info-border flex flex-col gap-3'>
      {/* 체크박스 */}
      <button
        onClick={onSelect}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          isSelected ? 'bg-primary-400 border-primary-400' : 'bg-white border-gray-200'
        }`}
      >
        {isSelected && (
          <svg width='10' height='8' viewBox='0 0 10 8' fill='none'>
            <path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        )}
      </button>

      {/* 꽃다발 이름 */}
      <Link href={`/my-bouquet/${bouquet.id}`} className='text-title-md'>
        {bouquet.name}
      </Link>

      {/* 기본 정보 */}
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <p className='text-body-sm text-gray-400'>상황</p>
          <p className='text-body-sm'>{bouquet.occasion}</p>
        </div>
        <div className='flex items-center justify-between'>
          <p className='text-body-sm text-gray-400'>받는 사람</p>
          <p className='text-body-sm'>{bouquet.recipient}</p>
        </div>
      </div>

      <div className='w-full h-px bg-gray-100' />

      {/* 전달 메시지 */}
      <div>
        <div className='flex items-center gap-2 mb-2'>
          <div className='w-5 h-5 rounded-1 bg-primary-400 flex items-center justify-center'>
            <svg width='10' height='2' viewBox='0 0 10 2' fill='none'>
              <path d='M1 1H9' stroke='white' strokeWidth='2' strokeLinecap='round' />
            </svg>
          </div>
          <p className='text-body-lg'>전달 메시지</p>
        </div>
        <div className='w-full min-h-[40px] px-3 py-2 rounded-4 bg-gray-50 text-body-sm text-gray-700'>
          {bouquet.message}
        </div>
      </div>

      {/* 담은 꽃 */}
      <div>
        <div className='flex items-center gap-2 mb-2'>
          <div className='w-5 h-5 rounded-1 bg-primary-400 flex items-center justify-center'>
            <svg width='10' height='10' viewBox='0 0 10 10' fill='none'>
              <path d='M5 1V9M1 5H9' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
          </div>
          <p className='text-body-lg'>담은 꽃</p>
        </div>
        <div className='flex gap-2'>
          {bouquet.flowers.map((flower) => (
            <div key={flower.id} className='flex-1 border border-gray-100 rounded-5 px-3 py-2 bg-white'>
              <p className='text-body-xsm text-center mb-2'>{flower.name}</p>
              <div className='flex justify-center gap-1'>
                {flower.colorAndQuantities.map(({ color, quantity }, idx) => (
                  <div key={idx} className='flex flex-col items-center'>
                    <div
                      className='w-8 h-8 rounded-full border-2 border-gray-100'
                      style={{ backgroundColor: color }}
                    />
                    <p className='text-body-xsm text-gray-400 mt-1 text-center w-8'>{quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <div className='flex items-center justify-between'>
        <button
          onClick={() => onDelete(bouquet.id)}
          className='text-body-xsm text-error hover:opacity-70'
        >
          꽃다발 삭제
        </button>
        <p className='text-body-xsm text-gray-400'>{bouquet.createdAt}</p>
      </div>
    </div>
  );
}
