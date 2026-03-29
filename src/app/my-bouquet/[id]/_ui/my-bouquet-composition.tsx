import type { BouquetDetailFlower } from '../_types';

interface MyBouquetCompositionProps {
  flowers: BouquetDetailFlower[];
}

interface FlowerGroup {
  flower_id: string;
  flower_name: string;
  tags: string[];
  colorAndQuantities: { color: string; quantity: number }[];
}

function groupFlowers(flowers: BouquetDetailFlower[]): FlowerGroup[] {
  const groupMap = new Map<string, FlowerGroup>();

  for (const flower of flowers) {
    const existing = groupMap.get(flower.flower_id);
    if (existing) {
      existing.colorAndQuantities.push({ color: flower.color, quantity: flower.quantity });
      if (!existing.tags.includes(flower.meaning)) {
        existing.tags.push(flower.meaning);
      }
    } else {
      groupMap.set(flower.flower_id, {
        flower_id: flower.flower_id,
        flower_name: flower.flower_name,
        tags: [flower.meaning],
        colorAndQuantities: [{ color: flower.color, quantity: flower.quantity }],
      });
    }
  }

  return Array.from(groupMap.values());
}

export default function MyBouquetComposition({ flowers }: MyBouquetCompositionProps) {
  const totalQuantity = flowers.reduce((sum, f) => sum + f.quantity, 0);
  const groups = groupFlowers(flowers);
  const totalKinds = groups.length;

  return (
    <div className='info-border px-micro'>
      <div className='flex items-start justify-between'>
        <p className='text-title-md'>꽃 구성</p>
        <p className='text-body-xsm text-gray-400'>{`총 ${totalQuantity}송이, ${totalKinds}종의 꽃`}</p>
      </div>
      <div className='mt-3 flex flex-col gap-4'>
        {groups.map((group, index) => (
          <div key={group.flower_id} className='flex flex-col gap-3'>
            {index > 0 && <div className='h-px bg-gray-100' />}
            <div className='flex flex-col gap-2'>
              <p className='text-body-lg'>{group.flower_name}</p>
              <div className='flex flex-wrap gap-x-2 gap-y-1'>
                {group.tags.map((tag) => (
                  <span key={tag} className='tag-chip'>{tag}</span>
                ))}
              </div>
            </div>
            <div className='flex gap-1'>
              {group.colorAndQuantities.map(({ color, quantity }) => (
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
