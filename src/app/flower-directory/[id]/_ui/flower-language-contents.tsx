import React from 'react';
import ColorFlowerIcon from '@/shared/assets/icons/color_flower.svg';

type TProps = {
  meanings: {
    color: string;
    description: string;
    tags: string[];
  }[];
};

function FlowerLanguageContents({ meanings }: TProps) {
  return (
    <div>
      <p className='text-title-md'>꽃말과 의미</p>
      <div className='flex flex-col gap-4 mt-3'>
        {meanings.map(({ color, description, tags }) => (
          <div key={color} className='flex flex-col'>
            <div className='flex items-center gap-1'>
              <span className='pr-[4.8px]'>
                <ColorFlowerIcon className='w-[14px] h-[14px]' style={{ fill: color }} />
              </span>
              <span className='text-body-lg'>색상</span>
            </div>
            <p className='mt-1 text-body-md'>{description}</p>
            <div className='flex items-center gap-1 text-body-sm text-gray-400'>
              { tags.map((tag) =>
                <span key={tag}>{`#${tag}`}</span>)
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlowerLanguageContents;
