'use client';

import { Suspense, useRef, useState } from 'react';
import { Button } from '@/shared/ui/button';
import ProfileDescriptionContainer from './profile-description-container';
import ProfileEditForm from './profile-edit-form';
import type { TProfileEditFormRef } from './profile-edit-form';

type TProps = {
  ProfileFallback: React.ReactNode;
};

export default function ProfilePageContent({ ProfileFallback }: TProps) {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<TProfileEditFormRef>(null);

  const handleButtonClick = () => {
    if (isEditing) {
      formRef.current?.submit();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className='h-full p-4 flex flex-col bg-white'>
      <div className='flex justify-between items-center'>
        <span className='px-micro text-[20px] font-medium leading-[28px] tracking-[-0.08px]'>내 프로필</span>
        <Button size='sm' onClick={handleButtonClick}>
          {isEditing ? '저장' : '수정'}
        </Button>
      </div>
      {isEditing ? (
        <ProfileEditForm ref={formRef} onSaveSuccess={() => setIsEditing(false)} />
      ) : (
        <Suspense fallback={ProfileFallback}>
          <ProfileDescriptionContainer />
        </Suspense>
      )}
    </div>
  );
}
