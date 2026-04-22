'use client';

import { useRef, useMemo } from 'react';
import Link from 'next/link';
import { useSetAtom } from 'jotai';
import { Button } from '@/shared/ui/button';
import BouquetListItem from './bouquet-list-item';
import { useBouquetListQuery } from '../_model/use-bouquet-list-query';
import { toComponentBouquet } from '../_model/bouquet-list-mapper';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import MyBouquetListController from './my-bouquet-list-controller';
import BulkDeleteConfirmModal from './bulk-delete-confirm-modal';
import { openModalAtom } from '@/shared/model/modal';
import { IMyBouquetListHub } from '../_types';

export default function BouquetListContent() {
  const { data, refetch } = useBouquetListQuery();
  const openModal = useSetAtom(openModalAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  const hub = useMemo<IMyBouquetListHub>(() => ({
    onToggleSelectMode: (pressed) => {
      const container = containerRef.current;
      if (!container) { return; }
      if (pressed) {
        container.setAttribute('data-select-mode', 'true');
      } else {
        container.removeAttribute('data-select-mode');
        container.querySelectorAll<HTMLElement>('[data-bouquet-id]').forEach((el) => {
          el.removeAttribute('data-selected');
        });
        container.querySelectorAll<HTMLInputElement>('input[type=checkbox]').forEach((input) => {
          input.checked = false;
        });
      }
    },
    onSelectItem: (id, checked) => {
      const container = containerRef.current;
      if (!container) { return; }
      const item = container.querySelector<HTMLElement>(`[data-bouquet-id="${id}"]`);
      const input = item?.querySelector<HTMLInputElement>('input[type=checkbox]');

      if (!item || !input) { return; }

      if (checked) {
        item.setAttribute('data-selected', 'true');
      } else {
        item.removeAttribute('data-selected');
      }
      input.checked = checked;
    },
    onSelectAll: (checked) => {
      const container = containerRef.current;
      if (!container) { return; }
      container.querySelectorAll<HTMLElement>('[data-bouquet-id]').forEach((el) => {
        if (checked) {
          el.setAttribute('data-selected', 'true');
        } else {
          el.removeAttribute('data-selected');
        }
        const input = el.querySelector<HTMLInputElement>('input[type=checkbox]');
        if (input) { input.checked = checked; }
      });
    },
    onDeleteSelected: () => {
      const container = containerRef.current;
      if (!container) { return; }
      const selectedEls = container.querySelectorAll<HTMLElement>('[data-selected="true"]');
      const ids = Array.from(selectedEls).map((el) => el.getAttribute('data-bouquet-id')!);

      const exitSelectMode = () => {
        container.removeAttribute('data-select-mode');
        container.querySelectorAll<HTMLElement>('[data-bouquet-id]').forEach((el) => {
          el.removeAttribute('data-selected');
        });
        container.querySelectorAll<HTMLInputElement>('input[type=checkbox]').forEach((input) => {
          input.checked = false;
        });
      };

      if (ids.length === 0) {
        exitSelectMode();
        return;
      }
      const onSuccess = () => {
        exitSelectMode();
        refetch();
      };
      openModal({
        id: 'bulk-delete-bouquets',
        position: 'center',
        canCloseOnBackgroundClick: true,
        component: (
          <BulkDeleteConfirmModal
            modalId='bulk-delete-bouquets'
            bouquetIds={ids}
            onSuccess={onSuccess}
          />
        ),
      });
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const bouquets = (data?.bouquets ?? []).map(toComponentBouquet);
  const { total } = data ?? {};

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-4 px-micro pt-4 pb-2 flex items-center justify-between'>
        <p className='text-title-lg'>내 꽃다발</p>
        <Button size='sm' asChild>
          <Link href='/main/ai-prompt/emotion'>
            <PlusIcon className='w-[9px] h-[9px] mx-[3.5px]' />
            <p className='text-ui-cta-sm text-primary-600 hover:text-primary-200'>새 꽃다발 만들기</p>
          </Link>
        </Button>
      </div>
      <div className='h-[2px] w-full bg-gray-100' />

      <div ref={containerRef} className='pt-4 px-4 pb-8 group/list'>
        <MyBouquetListController total={total ?? 0} hub={hub} />
        <div className='pt-3 flex flex-col gap-4'>
          {bouquets.map((bouquet) => (
            <BouquetListItem
              key={bouquet.id}
              bouquet={bouquet}
              onDeleteSuccess={refetch}
              hub={hub}
            />
          ))}
          {total === 0 && (
            <div className='flex flex-col items-center justify-center py-20 gap-2'>
              <p className='text-body-md text-gray-400 text-center whitespace-pre-wrap'>
                {'저장된 꽃다발이 없어요🥹\n바로 위 버튼을 눌러 새 꽃다발을 만들어 보세요!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
