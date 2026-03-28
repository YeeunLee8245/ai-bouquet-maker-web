'use client';

import { useEffect, useImperativeHandle, useMemo, useState } from 'react'; // forwardRef 삭제
import { useSetAtom } from 'jotai';
import { openModalAtom } from '@/shared/model/modal';
import { useProfileQuery } from '../_model/use-profile-query';
import { useUpdateProfileMutation } from '../_model/use-profile-mutation';
import WithdrawModal, { WITHDRAW_MODAL_ID } from './withdraw-modal';

export type TProfileEditFormRef = {
  submit: () => void;
};

const EDITABLE_FIELDS = [
  { id: 'nickname', label: '닉네임' },
  { id: 'bio', label: '소개' },
] as const;

// forwardRef 대신 일반 함수형 컴포넌트처럼 작성 (ref를 props로 직접 받음)
function ProfileEditForm({
  onSaveSuccess,
  ref,
}: {
  onSaveSuccess?: () => void;
  ref?: React.Ref<TProfileEditFormRef>;
}) {
  const { data } = useProfileQuery();
  const mutation = useUpdateProfileMutation();
  const openModal = useSetAtom(openModalAtom);

  const [form, setForm] = useState<Record<string, string>>({
    nickname: '',
    bio: '',
  });

  useEffect(() => {
    if (data?.profile) {
      setForm({
        nickname: data.profile.nickname ?? '',
        bio: data.profile.bio ?? '',
      });
    }
  }, [data?.profile]);

  const handleChange = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const isDirty = useMemo(() => {
    return (form.nickname !== (data?.profile?.nickname ?? '') ||
    form.bio !== (data?.profile?.bio ?? ''));
  }, [form, data?.profile]);

  const handleSubmit = () => {
    if (!isDirty) {
      onSaveSuccess?.();
      return;
    }
    mutation.mutate(
      { nickname: form.nickname, bio: form.bio },
      { onSuccess: () => onSaveSuccess?.(),
        /*
         * TODO: yeeun Toast 에러 처리
         * onError: () => showToast({ message: '에러가 발생했어요.', type: 'error' })
         */
      },
    );
  };

  // 여전히 외부 명령을 위해 useImperativeHandle은 필요합니다.
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  return (
    <div className='flex flex-col py-4 gap-4'>
      {EDITABLE_FIELDS.map(({ id, label }) => (
        <div key={id} className='flex flex-col gap-1 px-micro'>
          <label className='text-ui-label-sm text-gray-400'>{label}</label>
          <input
            type='text'
            value={form[id]}
            onChange={(e) => handleChange(id, e.target.value)}
            placeholder={label}
            className='w-full h-[42px] px-3 py-2 border border-gray-200 rounded-4 text-body-md text-gray-900 placeholder:text-gray-300 outline-none focus:border-primary-400'
          />
        </div>
      ))}
      <button
        type='button'
        onClick={() => openModal({ id: WITHDRAW_MODAL_ID, position: 'center', canCloseOnBackgroundClick: true, component: <WithdrawModal /> })}
        className='text-ui-textbtn-lg text-gray-400'
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default ProfileEditForm;
