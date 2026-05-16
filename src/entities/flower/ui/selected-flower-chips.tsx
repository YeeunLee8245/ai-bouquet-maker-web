'use client';

import { cn } from '@/shared/utils/styles';
import { ActionLabel } from '@/shared/ui/label';
import XIcon from '@/shared/assets/icons/x.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron_down.svg';
import { useCallback, useEffect, useRef, useState } from 'react';

type TFlowerChip = {
  id: string;
  name: string;
};

type TProps = {
  flowers: TFlowerChip[];
  onRemove: (id: string) => void;
  /** true: 2줄까지 펼침 없이 노출 (pc + page context). default false (1줄) */
  twoLineThreshold?: boolean;
};

function SelectedFlowerChips({ flowers, onRemove, twoLineThreshold = false }: TProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const checkOverflow = useCallback(() => {
    const el = listRef.current;
    if (!el) {return;}
    setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useEffect(() => {
    checkOverflow();
  }, [flowers, twoLineThreshold, checkOverflow]);

  const collapsedMaxH = twoLineThreshold ? 'max-h-[64px]' : 'max-h-[28px]';

  return (
    <div className='flex flex-col w-full min-w-0'>
      <div className='flex justify-between'>
        <span className='text-ui-label-sm text-gray-400 shrink-0'>선택한 꽃</span>
        {isOverflowing && (
          <button
            type='button'
            onClick={() => setExpanded((prev) => !prev)}
          >
            <ChevronDownIcon
              className={cn(
                'w-3 h-3 stroke-[#CCC] transition-transform duration-200 ease-in-out',
                expanded && 'rotate-180',
              )}
            />
          </button>
        )}
      </div>

      <div
        ref={listRef}
        className={cn(
          'flex flex-wrap gap-1 overflow-hidden transition-all duration-200 ease-in-out min-w-0',
          expanded ? 'max-h-[200px] mt-3' : `${collapsedMaxH} mt-1`,
          flowers.length === 0 && 'mt-0',
        )}
      >
        {flowers.map(({id, name}) => (
          <ActionLabel
            className='flex items-center text-ui-filter-sm'
            key={id}
            text={name}
            icon={
              <span onClick={() => onRemove(id)} className='cursor-pointer pl-micro pr-[3.2px]'>
                <XIcon className='w-[11px] h-[11px] fill-gray-200'/>
              </span>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default SelectedFlowerChips;
