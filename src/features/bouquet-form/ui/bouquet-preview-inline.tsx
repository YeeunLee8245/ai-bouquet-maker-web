/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { showToastAtom } from '@/shared/model/toast';
import { bouquetFlowersAtom, bouquetLayoutAtom } from '../model/bouquet-form.atoms';
import { useBouquetLayout, TPreviewFlower } from './modals/bouquet-preview-modal/use-bouquet-layout';
import DraggableFlower from './modals/bouquet-preview-modal/draggable-flower';
import { Z_WRAP_BACK, Z_WRAP_FRONT, Z_RIBBON } from '@entities/flower/model/bouquet-layout';
import { Button } from '@/shared/ui/button';

function DragHintIcon() {
  return (
    <svg width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M18 11V6a2 2 0 0 0-4 0v1' />
      <path d='M14 7V4a2 2 0 0 0-4 0v3' />
      <path d='M10 7.5a2 2 0 0 0-4 0V17a6 6 0 0 0 12 0v-5a2 2 0 0 0-4 0' />
    </svg>
  );
}

export default function BouquetPreviewInline() {
  const showToast = useSetAtom(showToastAtom);
  const setLayout = useSetAtom(bouquetLayoutAtom);
  const bouquetFlowers = useAtomValue(bouquetFlowersAtom);
  const initialFlowers = useBouquetLayout();
  const [flowers, setFlowers] = useState<TPreviewFlower[]>(initialFlowers);
  // 로드 시 초기 배치 기억 — 초기화 버튼의 기준점
  const loadTimeFlowersRef = useRef(initialFlowers);

  // 꽃 구성이 바뀌면 위치 재계산하고 초기화 기준점도 갱신
  const compositionKey = bouquetFlowers
    .map((f) => `${f.id}:${f.colorInfos.map((ci) => `${ci.hex}-${ci.quantity}`).join(',')}`)
    .join('|');
  const prevCompositionKeyRef = useRef(compositionKey);

  useEffect(() => {
    if (prevCompositionKeyRef.current !== compositionKey) {
      prevCompositionKeyRef.current = compositionKey;
      loadTimeFlowersRef.current = initialFlowers;
      setFlowers(initialFlowers);
    }
  }, [compositionKey, initialFlowers]);

  const handleMove = useCallback((index: number, x: number, y: number) => {
    setFlowers((prev) => prev.map((f, i) => (i === index ? { ...f, x, y } : f)));
  }, []);

  const handleReset = () => {
    setFlowers(loadTimeFlowersRef.current);
  };

  const handleSave = () => {
    setLayout(
      flowers.map((f) => ({
        flower_id: f.flowerId,
        flower_meaning_id: f.meaningId,
        x: f.x,
        y: f.y,
        color: f.color,
      })),
    );
    showToast({ message: '꽃 위치 수정이 완료되었어요.' });
  };

  return (
    <div className='mt-4 tablet:mt-0 border-1 border-gray-100 rounded-5 bg-white'>
      <div className='p-4 pb-0'>
        <p className='text-title-md'>꽃다발 미리보기</p>
        <p className='mt-1 px-micro text-body-md text-gray-400 whitespace-pre-wrap'>
          {'실제 꽃다발은 플로리스트가 예쁘게\n만들어 드려요.'}
        </p>
      </div>

      <div className='flex justify-center px-4 py-3'>
        <div
          className='relative overflow-hidden rounded-4 border-1 border-gray-100 bg-amber-200'
          style={{ width: 330, height: 330, isolation: 'isolate' }}
        >
          {/* 드래그 힌트 뱃지 */}
          {flowers.length > 0 && (
            <div className='absolute top-2.5 left-1/2 -translate-x-1/2 z-[998] pointer-events-none'>
              <span className='inline-flex items-center gap-1.5 rounded-full border text-nowrap  border-gray-200 bg-white/85 px-3 py-1 text-ui-textbtn-sm text-gray-500 shadow-sm backdrop-blur-sm'>
                <DragHintIcon />
                드래그해서 배치를 바꿔보세요
              </span>
            </div>
          )}

          <img
            src='/svgs/bouquet-wrap-back.svg'
            className='absolute left-0 w-full pointer-events-none'
            style={{ zIndex: Z_WRAP_BACK }}
            alt=''
          />

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

          <img
            src='/svgs/bouquet-wrap-front.svg'
            className='absolute bottom-0 left-0 w-full pointer-events-none'
            style={{ zIndex: Z_WRAP_FRONT }}
            alt=''
          />

          <img
            src='/svgs/bouquet-ribbon.svg'
            className='absolute bottom-[48px] left-1/2 -translate-x-1/2 pointer-events-none'
            style={{ zIndex: Z_RIBBON, width: 114 }}
            alt=''
          />
        </div>
      </div>

      <div className='flex items-center gap-2 px-4 pb-4'>
        <button
          type='button'
          onClick={handleReset}
          className='shrink-0 px-3 text-ui-textbtn-md text-gray-400 hover:text-gray-500'
        >
          초기화
        </button>
        <Button size='lg' className='flex-1' onClick={handleSave}>
          배치 저장
        </Button>
      </div>
    </div>
  );
}
