import { ColorPicker } from '@/shared/ui/color-picker';

export default function MyBouquetPackaging() {
  return (
    <div className='info-border px-micro'>
      <p className='text-title-md'>포장 옵션</p>
      <div className='mt-3 flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-body-lg'>포장지</p>
          <div className='flex flex-wrap gap-1'>
            <ColorPicker color='#83D400' />
            <ColorPicker color='#83D400' />
            <ColorPicker color='#83D400' />
            <ColorPicker color='#83D400' />
            <ColorPicker color='#83D400' />
            <ColorPicker color='#83D400' />
            <ColorPicker color='#83D400' />
            <ColorPicker color='#83D400' />
            <ColorPicker color='#83D400' />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-body-lg'>리본</p>
          <div className='flex flex-wrap gap-1'>
            <ColorPicker color='#83D400' />
            <ColorPicker color='#83D400' />
          </div>
        </div>
      </div>
    </div>
  );
}
