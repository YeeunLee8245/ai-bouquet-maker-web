import { ColorPicker } from '@/shared/ui/color-picker';

interface MyBouquetPackagingProps {
  wrapping: {
    wrappingColor: string | null;
    ribbonColor: string | null;
  };
}

export default function MyBouquetPackaging({ wrapping }: MyBouquetPackagingProps) {
  return (
    <div className='info-border px-micro'>
      <p className='text-title-md'>포장 옵션</p>
      <div className='mt-3 flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-body-lg'>포장지</p>
          <div className='flex flex-wrap gap-1'>
            {wrapping.wrappingColor ? (
              <ColorPicker color={wrapping.wrappingColor} />
            ) : (
              <p className='text-body-xsm text-gray-400'>선택 없음</p>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-body-lg'>리본</p>
          <div className='flex flex-wrap gap-1'>
            {wrapping.ribbonColor ? (
              <ColorPicker color={wrapping.ribbonColor} />
            ) : (
              <p className='text-body-xsm text-gray-400'>선택 없음</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
