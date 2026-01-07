import React from 'react';

type TProps = {
  title: {
    ko: string;
    en: string;
  };
  description: string;
  isLiked: boolean;
};

function FlowerDescContainer({ title, description, isLiked }: TProps) {
  const { ko, en } = title;
  return (
    <div className='flex flex-col px-4 py-4'>
      <div className='flex items-center justify-between'>
        <span className='text-title-lg'>{ko}</span>
        <span>LIKE BUTTON: {isLiked ? 'LIKED' : 'UNLIKED'}</span>
      </div>
      <p className='text-body-md text-gray-400'>{en}</p>
      <p className='text-body-sm mt-2 text-gray-400'>{description}</p>
    </div>
  );
}

export default FlowerDescContainer;
