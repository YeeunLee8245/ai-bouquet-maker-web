'use client';

import Link from 'next/link';
import ProfileBouquetCard from './profile-bouquet-card';
import { useUserAction } from '@/hooks/use-user-action';
import { useProfileQuery } from '../_model/use-profile-query';
import { getMyProfileDescriptionFields, getMyProfileBouquetData } from '../_datas';

function ProfileDescriptionContainer() {
  const { signOut } = useUserAction();
  const { data, isLoading } = useProfileQuery();

  if (isLoading) {
    return <div className='flex flex-col py-4 px-micro text-body-md text-gray-400'>불러오는 중...</div>;
  }

  if (!data) {
    return <div className='flex flex-col py-4 px-micro text-body-md text-gray-400'>프로필 정보를 불러올 수 없습니다.</div>;
  }

  const { profile, stats } = data;

  const descriptionFields = getMyProfileDescriptionFields(profile);

  const bouquetCards = getMyProfileBouquetData(stats);

  return (
    <div className='flex flex-col py-4'>
      <div className='flex flex-col gap-4 px-micro'>
        {descriptionFields.map(({ id, label, value }) => (
          <div key={id}>
            <div className='text-ui-label-sm text-gray-400'>{label}</div>
            <div className='text-body-md mt-1'>{value}</div>
          </div>
        ))}
      </div>
      <div className='flex flex-col mt-6 gap-3'>
        {bouquetCards.map(({ id, label, content, canClick }) =>
          canClick ? (
            <Link key={id} href='/my-bouquet' className='p-3 border-1 border-gray-100 rounded-5 cursor-pointer active:bg-gray-50'>
              <ProfileBouquetCard label={label} content={content} canClick={canClick} />
            </Link>
          ) : (
            <div key={id} className='p-3 border-1 border-gray-100 rounded-5'>
              <ProfileBouquetCard label={label} content={content} />
            </div>
          ),
        )}
      </div>
      <button onClick={signOut} className='text-ui-textbtn-lg text-gray-400 mt-4'>
        로그아웃
      </button>
    </div>
  );
}

export default ProfileDescriptionContainer;
