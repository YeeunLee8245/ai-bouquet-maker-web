'use client';

import { Tabs } from '@/shared/ui/tabs';
import React, { useState, useLayoutEffect, useRef } from 'react';
import { flowerTabItems } from '../_datas';
import FlowerLanguageContents from './FlowerLanguageContents';
import FlowerFloweringTimeContents from './FlowerFloweringTimeContents';
import FlowerManagementContents from './FlowerManagementContents';

type TProps = {
  meanings: {
    color: string;
    description: string;
    tags: string[];
  }[];
};

function FlowerTabContainer({ meanings }: TProps) {
  const [currentValue, setCurrentValue] = useState<string>(flowerTabItems[0].value);
  const listRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // 탭 인디케이터 위치 계산
  useLayoutEffect(() => {
    const listEl = listRef.current;
    const triggerEl = triggerRefs.current[currentValue];
    if (!listEl || !triggerEl) {return;}
    const listRect = listEl.getBoundingClientRect();
    const triggerRect = triggerEl.getBoundingClientRect();
    setIndicatorStyle({
      left: triggerRect.left - listRect.left,
      width: triggerRect.width,
    });
  }, [currentValue]);

  return (
    <div>
      <Tabs value={currentValue} onValueChange={setCurrentValue} className='px-4 pb-5'>
        <Tabs.List ref={listRef} className='relative flex gap-2'>
          {flowerTabItems.map(({ value, label }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              ref={(el) => { triggerRefs.current[value] = el; }}
              className='relative py-3 text-center flex-1'
            >
              <p className='text-ui-tap-lg text-primary-600'>{label}</p>
            </Tabs.Trigger>
          ))}
          <div
            className='absolute bottom-0 h-micro bg-primary-200 transition-[left,width] duration-200'
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        </Tabs.List>
        {flowerTabItems.map(({ value }) => (
          <Tabs.Content key={value} value={value} className='mt-4'>
            {value === '1' && <FlowerLanguageContents meanings={meanings} />}
            {value === '2' && <FlowerFloweringTimeContents />}
            {value === '3' && <FlowerManagementContents />}
          </Tabs.Content>
        ))}
      </Tabs>
    </div>
  );
}

export default FlowerTabContainer;
