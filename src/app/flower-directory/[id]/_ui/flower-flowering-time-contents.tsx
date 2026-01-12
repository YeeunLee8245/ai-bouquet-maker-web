import React from 'react';

type TProps = {
  floweringTime: {
    season: string[];
    months: string[];
  };
};

function FlowerFloweringTimeContents({ floweringTime }: TProps) {
  const { season, months } = floweringTime;
  return (
    <div>
      <p className='text-title-md'>개화 시기</p>
      <div className='flex items-center gap-2 mt-3 flex-wrap'>
        {season.map((season) => (
          <span key={season} className='flex items-center gap-1 flex-wrap'>
            <span>Icon</span>
            <span className='text-body-lg'>{season}</span>
          </span>
        ))}
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
}

export default FlowerFloweringTimeContents;
