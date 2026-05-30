/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { showToastAtom } from '@/shared/model/toast';
import { bouquetLayoutAtom } from '../../../model/bouquet-form.atoms';
import { useBouquetLayout, TPreviewFlower } from './use-bouquet-layout';
import DraggableFlower from './draggable-flower';
import { Z_WRAP_BACK, Z_WRAP_FRONT, Z_RIBBON } from '@entities/flower/model/bouquet-layout';
import { Button } from '@/shared/ui/button';

function BouquetFormPreviewModal({ modalId }: TModalProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const showToast = useSetAtom(showToastAtom);
  const setLayout = useSetAtom(bouquetLayoutAtom);
  const initialFlowers = useBouquetLayout();

  const [flowers, setFlowers] = useState<TPreviewFlower[]>(initialFlowers);

  const handleMove = useCallback((index: number, x: number, y: number) => {
    setFlowers((prev) =>
      prev.map((f, i) => (i === index ? { ...f, x, y } : f)),
    );
  }, []);

  const handleSave = () => {
    setLayout(flowers.map((f) => ({
      flower_id: f.flowerId,
      flower_meaning_id: f.meaningId,
      x: f.x,
      y: f.y,
      color: f.color,
    })));
    showToast({ message: '꽃 위치 수정이 완료되었어요.' });
    closeModal(modalId);
  };

  return (
    <div className='relative flex flex-col w-[360px] bg-gray-50 rounded-t-5 tablet:rounded-5'>
      {/* 헤더 */}
      <div className='flex justify-between items-center px-4 pt-4 pb-2 tablet:px-6 tablet:pt-6'>
        <p className='text-title-md px-micro'>꽃다발 미리보기</p>
        <button
          type='button'
          className='text-ui-textbtn-md text-gray-400 hover:text-gray-500'
          onClick={() => closeModal(modalId)}
        >
          닫기
        </button>
      </div>

      {/* 캔버스 */}
      <div className='flex justify-center px-4 py-2'>
        <div
          className='relative overflow-hidden rounded-4 border-1 border-gray-100 bg-amber-200'
          style={{ width: 330, height: 330, isolation: 'isolate' }}
        >
          {/* 포장지 뒷면 */}
          <img
            src='/svgs/bouquet-wrap-back.svg'
            className='absolute left-0 w-full pointer-events-none'
            style={{ zIndex: Z_WRAP_BACK }}
            alt=''
          />

          {/* 꽃 (y 기반 z-index, 아래일수록 앞) */}
          {flowers.map((flower, index) => (
            <DraggableFlower
              key={flower.id}
              svgUrl={flower.svgUrl}
              x={flower.x}
              y={flower.y}
              size={flower.size}
              onMove={(x, y) => handleMove(index, x, y)}
            />
          ))}

          {flowers.length === 0 && (
            <div
              className='absolute inset-0 flex items-center justify-center text-body-md text-gray-300'
              style={{ zIndex: 3 }}
            >
              꽃을 추가해 주세요
            </div>
          )}

          {/* 포장지 앞면 */}
          <img
            src='/svgs/bouquet-wrap-front.svg'
            className='absolute bottom-0 left-0 w-full pointer-events-none'
            style={{ zIndex: Z_WRAP_FRONT }}
            alt=''
          />

          {/* 리본 */}
          <img
            src='/svgs/bouquet-ribbon.svg'
            className='absolute bottom-[48px] left-1/2 -translate-x-1/2 pointer-events-none'
            style={{ zIndex: Z_RIBBON, width: 114 }}
            alt=''
          />
        </div>
      </div>

      <div className='px-4 pb-6 tablet:px-6'>
        <Button size='lg' className='w-full' onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
}

export default BouquetFormPreviewModal;
