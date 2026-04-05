import type { IBouquetDetailFlower } from '../_types';

interface IMyBouquetCompositionProps {
  flowers: IBouquetDetailFlower[];
}

export default function MyBouquetComposition({ flowers }: IMyBouquetCompositionProps) {
  const totalQuantity = flowers.reduce(
    (sum, f) => sum + f.color_and_quantity.reduce((s, cq) => s + cq.quantity, 0),
    0,
  );

  return (
    <div className='info-border px-micro'>
      <div className='flex items-start justify-between'>
        <p className='text-title-md'>꽃 구성</p>
        <p className='text-body-xsm text-gray-400'>{`총 ${totalQuantity}송이, ${flowers.length}종의 꽃`}</p>
      </div>
      <div className='mt-3 flex flex-col gap-4'>
        {flowers.map((flower, index) => (
          <div key={flower.flower_id} className='flex flex-col gap-3'>
            {index > 0 && <div className='h-px bg-gray-100' />}
            <div className='flex flex-col gap-2'>
              <p className='text-body-lg'>{flower.flower_name}</p>
              <div className='flex flex-wrap gap-x-2 gap-y-1'>
                {flower.tags.map((tag) => (
                  <span key={tag} className='tag-chip'>{tag}</span>
                ))}
              </div>
            </div>
            <div className='flex gap-1'>
              {flower.color_and_quantity.map(({ color, quantity }) => (
                <div key={color} className='flex flex-col items-center'>
                  <div className='p-px'>
                    <div
                      className='w-8 h-8 rounded-full border-2 border-gray-100'
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <p className='w-8 text-center text-body-xsm text-gray-400'>{quantity}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
