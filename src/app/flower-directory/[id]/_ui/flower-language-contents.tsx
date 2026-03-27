import React from 'react';
import { TFlowerMeaning } from '../_types';
import Image from 'next/image';
import ColorFlowerIcon from '@/shared/assets/icons/color_flower.svg';

type TProps = {
  meanings: TFlowerMeaning[];
};

function FlowerLanguageContents({ meanings }: TProps) {

  return (
    <div>
      <p className='text-title-md'>꽃말과 의미</p>
      <div className='flex flex-col gap-4 mt-3'>
        {meanings.map(({ colorName, color, description, tags }) => (
          <div key={color} className='flex flex-col'>
            <div className='flex items-center gap-1'>
              <span className='pr-[4.8px]'>
                {/* 전체일 때는 무지개 색상으로 표시 */}
                {colorName !== '전체' ? (
                  <ColorFlowerIcon className='w-[14px] h-[14px]' style={{ fill: color }} />
                ) : (
                  <Image src='/images/color_flower_rainbow.png' alt='rainbow' width={14} height={14} />
                )}
              </span>
              {/* TODO: yeeun 색상 이름 매칭 QA 테스트 주목 필요 */}
              <span className='text-body-lg'>{colorName}</span>
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
