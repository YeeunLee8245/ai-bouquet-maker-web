'use client';

import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { showToastAtom } from '@/shared/model/toast';
import { Button } from '@/shared/ui/button';

type Props = TModalProps & {
  bouquetId: string;
  bouquetName: string;
  messageSignature?: string;
};

export default function ShareModal({ modalId, bouquetId, bouquetName, messageSignature }: Props) {
  const closeModal = useSetAtom(closeModalAtom);
  const showToast = useSetAtom(showToastAtom);
  const [includeMessage, setIncludeMessage] = useState(true);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = includeMessage && messageSignature
    ? `${baseUrl}/share/bouquet/${bouquetId}?sig=${messageSignature}`
    : `${baseUrl}/share/bouquet/${bouquetId}`;

  const handleCopy = async () => {
    try {
      const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!isDesktop && navigator.share) {
        await navigator.share({
          title: bouquetName,
          text: '내가 만든 예쁜 꽃다발을 확인해보세요!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast({ message: '주소가 복사되었어요' });
      }
      closeModal(modalId);
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  return (
    <div className='w-[328px] bg-white border-1 border-gray-100 rounded-5 px-6 py-6 flex flex-col gap-5'>
      <div className='flex flex-col gap-1.5'>
        <p className='text-title-md'>꽃다발 공유하기</p>
        <p className='text-body-sm text-gray-400'>
          내가 만든 꽃다발의 링크를 공유하여{'\n'}친구들에게 보여줄 수 있어요.
        </p>
      </div>

      <div className='flex flex-col gap-3 p-4 bg-gray-50 rounded-3 border-1 border-gray-100'>
        <label className='relative flex items-center justify-between cursor-pointer'>
          <span className='text-body-md font-medium text-gray-700'>카드 메시지 포함</span>
          <div className='relative'>
            <input
              type='checkbox'
              checked={includeMessage}
              onChange={(e) => setIncludeMessage(e.target.checked)}
              className='sr-only peer'
              disabled={!messageSignature}
            />
            <div className='w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500 peer-disabled:bg-gray-100 peer-disabled:cursor-not-allowed'></div>
          </div>
        </label>
        <p className='text-body-xsm text-gray-400'>
          {!messageSignature 
            ? '이 꽃다발에는 작성된 카드 메시지가 없습니다.' 
            : '활성화하면 공유 링크를 받은 사람도 내가 작성한 카드 메시지를 읽을 수 있습니다.'}
        </p>
      </div>

      <div className='flex flex-col gap-1.5'>
        <label className='text-body-xsm font-bold text-gray-400'>공유 링크</label>
        <input
          type='text'
          readOnly
          value={shareUrl}
          className='w-full px-3 py-2 text-body-sm text-gray-500 bg-gray-50 rounded-2 border-1 border-gray-200 outline-none select-all truncate'
        />
      </div>

      <div className='flex flex-col items-center gap-2 mt-1'>
        <Button
          type='button'
          onClick={handleCopy}
          size={'lg'}
          className='w-full'
        >
          링크 복사하기
        </Button>
        <button
          type='button'
          onClick={() => closeModal(modalId)}
          className='text-ui-textbtn-lg text-gray-400 py-1 hover:text-gray-600 transition-colors'
        >
          취소
        </button>
      </div>
    </div>
  );
}
