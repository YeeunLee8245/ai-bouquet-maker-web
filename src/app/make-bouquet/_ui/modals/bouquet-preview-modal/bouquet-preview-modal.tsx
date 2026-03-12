'use client';

import { useState, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { useBouquetLayout, TPreviewFlower } from './use-bouquet-layout';
import DraggableFlower from './draggable-flower';
import InlineColorPicker from './inline-color-picker';

function BouquetPreviewModal({ modalId }: TModalProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const initialFlowers = useBouquetLayout();

  const [flowers, setFlowers] = useState<TPreviewFlower[]>(initialFlowers);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleMove = useCallback((index: number, x: number, y: number) => {
    setFlowers((prev) =>
      prev.map((f, i) => (i === index ? { ...f, x, y } : f)),
    );
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleColorApply = useCallback((color: string) => {
    if (selectedIndex === null) {
      return;
    }
    setFlowers((prev) =>
      prev.map((f, i) => (i === selectedIndex ? { ...f, color } : f)),
    );
  }, [selectedIndex]);

  const selectedFlower = selectedIndex !== null ? flowers[selectedIndex] : null;

  return (
    <div className='relative flex flex-col w-[360px] bg-gray-50 rounded-t-5'>
      {/* 헤더 */}
      <div className='flex justify-between items-center px-4 pt-4 pb-2'>
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
          className='relative overflow-hidden rounded-4 border-1 border-gray-100 bg-amber-100'
          style={{ width: 330, height: 330 }}
          onPointerUp={() => setSelectedIndex(null)}
        >
          {flowers.map((flower, index) => (
            <DraggableFlower
              key={flower.id}
              svgUrl={flower.svgUrl}
              color={flower.color}
              x={flower.x}
              y={flower.y}
              selected={selectedIndex === index}
              onSelect={() => handleSelect(index)}
              onMove={(x, y) => handleMove(index, x, y)}
            />
          ))}

          {flowers.length === 0 && (
            <div className='flex items-center justify-center h-full text-body-md text-gray-300'>
              꽃을 추가해 주세요
            </div>
          )}
        </div>
      </div>

      {/* 선택된 꽃 이름 표시 */}
      {selectedFlower && (
        <p className='px-5 pt-2 text-body-xsm text-gray-500'>
          선택: {selectedFlower.name}
        </p>
      )}

      {/* 색상 변경 UI */}
      {selectedFlower && (
        <div className='pt-2'>
          <InlineColorPicker
            key={selectedIndex}
            initialColor={selectedFlower.color}
            onApply={handleColorApply}
          />
        </div>
      )}

      {/* 하단 여백 (색상 선택기가 없을 때) */}
      {!selectedFlower && <div className='pb-6' />}
    </div>
  );
}

export default BouquetPreviewModal;
