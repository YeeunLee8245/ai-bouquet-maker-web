import { Checkbox } from '@/shared/ui/checkbox';
import { IMyBouquetListHub } from '@/app/my-bouquet/_types';

type Props = {
  total: number;
  hub: IMyBouquetListHub;
};

export default function MyBouquetListController({ total, hub }: Props) {
  return (
    <div className='flex items-center justify-between'>
      {/* 전체선택 체크박스 — select mode 시만 표시 */}
      <div
        className='hidden pointer-events-none group-data-[select-mode=true]/list:flex group-data-[select-mode=true]/list:items-center group-data-[select-mode=true]/list:pointer-events-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox onChange={(checked) => hub.onSelectAll(checked)} />
        <div className='ml-2 text-ui-label-sm text-gray-400'>선택 삭제</div>
      </div>

      {/* 꽃다발 개수 — select mode 시 숨김 */}
      <p className='text-ui-label-sm text-gray-400 group-data-[select-mode=true]/list:hidden'>
        {total}개의 꽃다발
      </p>

      {/* 선택 버튼 — select mode 시 숨김 */}
      <button
        type='button'
        onClick={() => hub.onToggleSelectMode(true)}
        className='text-body-sm rounded-3 hover:bg-gray-100 hover:text-primary-600 group-data-[select-mode=true]/list:hidden'
      >
        선택
      </button>

      {/* 완료 버튼 — select mode 시만 표시 */}
      <button
        type='button'
        onClick={() => hub.onDeleteSelected()}
        className='text-body-sm rounded-3 hover:bg-gray-100 hover:text-primary-600 hidden group-data-[select-mode=true]/list:block'
      >
        완료
      </button>
    </div>
  );
}
