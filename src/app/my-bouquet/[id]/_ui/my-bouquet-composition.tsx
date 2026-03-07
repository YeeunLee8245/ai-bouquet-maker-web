import { MY_BOUQUET_COMPOSITION_DATAS } from '../_datas';

export default function MyBouquetComposition() {
  return (
    <div className='info-border px-micro'>
      <div className='flex items-start justify-between'>
        <p className='text-title-md'>꽃 구성</p>
        <p className='text-body-xsm text-gray-400'>{`총 ${3}송이, ${2}종의 꽃`}</p>
      </div>
      <div className='mt-3 flex flex-col'>
        {MY_BOUQUET_COMPOSITION_DATAS.map(({ id, name, tags, colorAndQuantities }) => (
          <div key={id}>
            <p className='text-body-lg'>{name}</p>
            <div className='flex gap-2 mt-2'>
              {tags.map((tag) => (
                <span key={tag} className='tag-chip'>{tag}</span>
              ))}
            </div>
            <div className='flex gap-1 mt-3'>
              {colorAndQuantities.map(({ color, quantity }, index) => (
                <div key={color} className='flex flex-col'>
                  <div className='w-[32px] h-[32px] rounded-full border-2 border-gray-100 bg-[#BDBDBD] m-1' style={{ backgroundColor: color }}/>
                  <p className='w-[32px] text-center text-body-xsm mx-1 text-gray-400'>{quantity}</p>
                  {index !== colorAndQuantities.length - 1 && <div className='w-full h-[1px] bg-gray-100 py-[2px] my-4'/>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
