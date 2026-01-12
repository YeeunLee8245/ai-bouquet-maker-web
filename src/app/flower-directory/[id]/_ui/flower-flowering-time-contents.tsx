import React from 'react';
import SpringIcon from '@/shared/assets/icons/spring.svg';
import SummerIcon from '@/shared/assets/icons/summer.svg';
import AutumnIcon from '@/shared/assets/icons/fall.svg';
import WinterIcon from '@/shared/assets/icons/winter.svg';
import { DIRECTORY_SEASON_NAME_MAP } from '../../_datas';

type TProps = {
  floweringTime: {
    season: (keyof typeof DIRECTORY_SEASON_NAME_MAP)[];
    months: string[];
  };
};

function FlowerFloweringTimeContents({ floweringTime }: TProps) {
  const { season, months } = floweringTime;
  return (
    <div className='flex flex-col gap-3'>
      <p className='text-title-md'>개화 시기</p>
      {season.map((id) => {
        const name = DIRECTORY_SEASON_NAME_MAP[id];
        return (
          <div key={id}>
            <div className='flex items-center gap-2flex-wrap'>
              <span className='flex items-center gap-1 flex-wrap'>
                <span className='pr-[5.27px]'>
                  { id === 'spring' && <SpringIcon />}
                  { id === 'summer' && <SummerIcon />}
                  { id === 'autumn' && <AutumnIcon />}
                  { id === 'winter' && <WinterIcon />}
                </span>
                <span className='text-body-lg'>{name}</span>
              </span>
            </div>
            <div className='mt-2 flex items-center gap-2 flex-wrap'>
              {months.map((month) => (
                <span key={month} className='py-1 px-2 text-ui-tag text-gray-400 flex-wrap bg-gray-100 rounded-3'>
                  {month}월
                </span>
              ))}
            </div>
          </div>
        );
      })}

    </div>
  );
}

export default FlowerFloweringTimeContents;
