import React from 'react';

type TProps = {
  management: string;
};

function FlowerManagementContents({ management }: TProps) {
  return (
    <div>
      <p className='text-title-md'>관리법</p>
      <p className='mt-3 text-body-md'>{management}</p>
    </div>
  );
}

export default FlowerManagementContents;
