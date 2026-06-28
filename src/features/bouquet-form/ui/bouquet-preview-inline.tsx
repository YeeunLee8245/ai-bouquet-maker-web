/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { bouquetFlowersAtom, bouquetLayoutAtom } from '../model/bouquet-form.atoms';
import { useBouquetLayout, TPreviewFlower } from './modals/bouquet-preview-modal/use-bouquet-layout';
import DraggableFlower from './modals/bouquet-preview-modal/draggable-flower';
import { Z_WRAP_BACK, Z_WRAP_FRONT, Z_RIBBON, CANVAS } from '@entities/flower/model/bouquet-layout';
import HandeDragIcon from '@/shared/assets/icons/hande_drag.svg';

export default function BouquetPreviewInline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(CANVAS);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {return;}
    const update = () => setCanvasSize(Math.min(CANVAS, el.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const posScale = canvasSize / CANVAS;

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

  // DraggableFlower가 캔버스 물리 좌표(canvasSize)로 onMove를 전달하므로
  // flowers 상태는 항상 330px 기준 좌표로 역변환해 저장
  const posScaleRef = useRef(posScale);
  useEffect(() => {
    posScaleRef.current = posScale;
  }, [posScale]);

  const handleMove = useCallback((index: number, scaledX: number, scaledY: number) => {
    setFlowers((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, x: scaledX / posScaleRef.current, y: scaledY / posScaleRef.current } : f,
      ),
    );
  }, []);

  const handleReset = () => {
    setFlowers(loadTimeFlowersRef.current);
  };

  // 드래그 종료 시 bouquetLayoutAtom에 자동 반영
  const flowersRef = useRef(flowers);

  useEffect(() => {
    flowersRef.current = flowers;
  }, [flowers]);

  const handleMoveEnd = useCallback(() => {
    setLayout(
      flowersRef.current.map((f) => ({
        flower_id: f.flowerId,
        flower_meaning_id: f.meaningId,
        x: f.x,
        y: f.y,
        color: f.color,
      })),
    );
  }, [setLayout]);

  return (
    <div className='mt-4 tablet:mt-0 border-1 border-gray-100 rounded-5 bg-white'>
      <div className='p-4 pb-0'>
        <p className='text-title-md'>꽃다발 미리보기</p>
        <p className='mt-1 px-micro text-body-md text-gray-400 whitespace-pre-wrap'>
          {'실제 꽃다발은 플로리스트가 예쁘게\n만들어 드려요.'}
        </p>
      </div>

      <div className='pt-3'>
        <div ref={containerRef} style={{ width: '100%', maxWidth: CANVAS, margin: '0 auto' }}>
          <div
            className='relative overflow-hidden rounded-4 border-1 border-gray-100 bg-amber-200'
            style={{ width: canvasSize, height: canvasSize, isolation: 'isolate' }}
          >
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
                x={flower.x * posScale}
                y={flower.y * posScale}
                size={flower.size * posScale}
                onMove={(x, y) => handleMove(index, x, y)}
                onMoveEnd={handleMoveEnd}
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
              className='absolute left-1/2 -translate-x-1/2 pointer-events-none'
              style={{ zIndex: Z_RIBBON, width: 114 * posScale, bottom: 48 * posScale }}
              alt=''
            />
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between px-4 pb-4 pt-2'>
        {flowers.length > 0 ? (
          <span className='flex items-center gap-1.5'>
            <HandeDragIcon className='w-[16px] h-[22px] fill-primary-300' />
            <span className='text-ui-textbtn-sm text-gray-400'>드래그해서 배치를 바꿔보세요</span>
          </span>
        ) : (
          <span />
        )}
        <button
          type='button'
          onClick={handleReset}
          className='text-ui-textbtn-md text-gray-400 hover:text-gray-500'
        >
          초기화
        </button>
      </div>
    </div>
  );
}
