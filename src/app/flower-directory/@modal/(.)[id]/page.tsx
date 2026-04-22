import React from 'react';
import FlowerDetailPage from '../../[id]/page';

type TProps = {
  params: Promise<{ id: string }>;
};

async function FlowerDetailModalPage({ params }: TProps) {
  return (
    <div className='absolute inset-0 z-modal bg-background'>
      <FlowerDetailPage params={params} />
    </div>
  );
};

export default FlowerDetailModalPage;
