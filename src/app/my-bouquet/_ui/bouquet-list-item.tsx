'use client';

import Link from 'next/link';
import { useSetAtom } from 'jotai';
import { openModalAtom } from '@/shared/model/modal';
import MessageIcon from '@/shared/assets/icons/message.svg';
import ColorFlowerIcon from '@/shared/assets/icons/color_flower.svg';
import DeleteConfirmModal from './delete-confirm-modal';

type BouquetFlower = {
  flower_id: string;
  flower_name: string;
  color_and_quantity: { color: string; quantity: number }[];
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
  onDeleteSuccess?: () => void;
  // isSelected: boolean;
  // onSelect: () => void;
};

export default function BouquetListItem({ bouquet, onDeleteSuccess }: Props) {
  const openModal = useSetAtom(openModalAtom);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal({
      id: `delete-bouquet-${bouquet.id}`,
      position: 'center',
      canCloseOnBackgroundClick: true,
      component: <DeleteConfirmModal
        modalId={`delete-bouquet-${bouquet.id}`}
        bouquetId={bouquet.id}
        onSuccess={onDeleteSuccess} />,
    });
  };

  return (
    <Link href={`/my-bouquet/${bouquet.id}`} className='info-border flex flex-col'>
      {/* 체크박스 */}
      {/* 꽃다발 이름 */}
      <p className='text-title-md'>{bouquet.name}</p>

      {/* 기본 정보 */}
      <div className='mt-3 flex flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <p className='text-body-lg text-gray-400'>상황</p>
          <p className='text-body-md'>{bouquet.occasion}</p>
        </div>
        <div className='flex items-center justify-between'>
          <p className='text-body-lg text-gray-400'>받는 사람</p>
          <p className='text-body-md'>{bouquet.recipient}</p>
        </div>
      </div>

      <div className='my-3 w-full h-px bg-gray-100' />

      {/* 전달 메시지 */}
      <div>
        <div className='flex items-center gap-1'>
          <MessageIcon className='ml-[1.6px] mr-[2.4px] w-4 h-4 fill-primary-300' />
          <p className='text-body-lg'>전달 메시지</p>
        </div>
        <div className='mt-2 w-full min-h-[40px] px-3 py-2 rounded-4 bg-gray-50 text-body-md'>
          {bouquet.message}
        </div>
      </div>

      {/* 담은 꽃 */}
      <div className='mt-4'>
        <div className='flex items-center gap-1'>
          <ColorFlowerIcon className='ml-[2.4px] mr-[4.6px] w-[14px] h-[14px] fill-primary-300' />
          <p className='text-body-lg'>담은 꽃</p>
        </div>
        <div className='mt-2 flex gap-2 overflow-x-auto'>
          {/* 3종류까지 미리보기 표시 */}
          {bouquet.flowers.slice(0, 3).map(({flower_id, flower_name, color_and_quantity}) => (
            <div key={flower_id} className='flex-none border border-gray-100 rounded-4 px-3 py-2 bg-white gap-1'>
              <p className='text-body-md truncate'>{flower_name}</p>
              <div className='flex justify-start gap-1'>
                {color_and_quantity.slice(0, 3).map(({ color, quantity }, idx) => (
                  <div key={idx}>
                    <div className='m-[1px] size-8 rounded-full border-2 border-gray-100' style={{ backgroundColor: color }}/>
                    <p className='text-body-xsm text-gray-400 mx-1 text-center'>{quantity}</p>
                  </div>
                ))}
                {color_and_quantity.length > 3 && (
                  <div className='flex items-center'>
                    <p className='text-body-xsm text-gray-400'>+{color_and_quantity.length - 3}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <div className='mt-3 flex items-center justify-between'>
        <button
          onClick={handleDeleteClick}
          className='text-ui-textbtn-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-3'
          type='button'
          aria-label='꽃다발 삭제'
        >
          꽃다발 삭제
        </button>
        <p className='text-body-xsm text-gray-400'>{bouquet.createdAt}</p>
      </div>
    </Link>
  );
}
