import React from 'react';
import Link from 'next/link';
import { profileBouquetData, profileDescriptionData } from '../_datas';
import ProfileBouquetCard from './profile-bouquet-card';

function ProfileDescriptionContainer() {
  return (
    <div className='flex flex-col py-4'>
      <div className='flex flex-col gap-4 px-micro'>
        {profileDescriptionData.map(({ id, label, value }) => (
          <div key={id}>
            <div className='text-ui-label-sm text-gray-400'>{label}</div>
            <div className='text-body-md mt-1'>{value}</div>
          </div>
        ))}
      </div>
      <div className='flex flex-col mt-6 gap-3'>
        {profileBouquetData.map(({ id, label, description, canClick }) =>
          canClick ? (
            <Link key={id} href='/my-bouquet' className='p-3 border-1 border-gray-100 rounded-5 cursor-pointer active:bg-gray-50'>
              <ProfileBouquetCard label={label} content={description} canClick={canClick} />
            </Link>
          ) : (
            <div key={id} className='p-3 border-1 border-gray-100 rounded-5'>
              <ProfileBouquetCard label={label} content={description} />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default ProfileDescriptionContainer;
