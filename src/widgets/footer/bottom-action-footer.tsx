'use client';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/styles';
import XIcon from '@/shared/assets/icons/x.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron_down.svg';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedFlowersAtom, removeFlowerAtom } from '@/entities/flower/model/selected-flowers';
import { showToastAtom } from '@/shared/model/toast';
import { aiRecommendationResultAtom } from '@/app/main/ai-prompt/_model/recommendation-result.atoms';
import { postUserSelection } from '@api/recommend-user-selection.api';
import { BOUQUET_FROM_AI_PARAM } from '@features/bouquet-form';
import { ActionLabel } from '@/shared/ui/label';

type TFlowerChip = {
  id: string;
  name: string;
};

type TSelectedFlowerChipsProps = {
  flowers: TFlowerChip[];
  onRemove: (id: string) => void;
};

type TProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  flowers?: TFlowerChip[];
  fromAiPrompt?: boolean;
  onRemoveFlower?: (id: string) => void;
};

function SelectedFlowerChips({ flowers, onRemove }: TSelectedFlowerChipsProps) {
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
  }, [flowers, checkOverflow]);

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between'>
        <span className='text-ui-label-sm text-gray-400 shrink-0'>선택한 꽃</span>
        {/* TODO: yeeun 접었을 때 2번째 줄 텍스트 살짝 보이는 문제 수정 */}
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
          expanded ? 'max-h-[200px] mt-3' : 'max-h-[28px] mt-1',
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

/**
 * SelectedFlowerChips의 기본 데이터 소스(selectedFlowersAtom)를 사용하는 래퍼
 */
function DefaultSelectedFlowerChips() {
  const flowers = useAtomValue(selectedFlowersAtom);
  const removeFlower = useSetAtom(removeFlowerAtom);
  return <SelectedFlowerChips flowers={flowers} onRemove={removeFlower} />;
}

function BottomActionFooter({ title, children, flowers, onRemoveFlower, fromAiPrompt }: TProps) {
  const router = useRouter();
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const aiResult = useAtomValue(aiRecommendationResultAtom);
  const showToast = useSetAtom(showToastAtom);

  const handleMakeBouquet = () => {
    if (selectedFlowers.length === 0) {
      showToast({ message: '꽃을 1개 이상 선택해주세요.' });
      return;
    }

    if (fromAiPrompt && aiResult) {
      const flowerMeaningIds = selectedFlowers
        .map((sf) => aiResult.recommendations.find((r) => r.id === sf.id)?.flowerMeaningId)
        .filter((id): id is string => id !== undefined)
        .map(Number);
      if (flowerMeaningIds.length > 0) {
        postUserSelection(aiResult.recommendationId, flowerMeaningIds);
      }
      router.push(`/make-bouquet?${BOUQUET_FROM_AI_PARAM}`);
      return;
    }
    router.push('/make-bouquet');
  };

  return (
    <footer
      className='py-3 px-4 pb-8 w-full flex flex-col gap-3 border-t border-gray-100 bg-white'
      style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
    >
      {flowers && onRemoveFlower
        ? <SelectedFlowerChips flowers={flowers} onRemove={onRemoveFlower} />
        : <DefaultSelectedFlowerChips />
      }
      {title && (
        <Button size='lg' onClick={handleMakeBouquet}>
          {title}
        </Button>
      )}
      {children}
    </footer>
  );
}

export default BottomActionFooter;
