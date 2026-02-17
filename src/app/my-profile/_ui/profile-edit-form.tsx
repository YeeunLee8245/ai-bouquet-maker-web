'use client';

import { useState } from 'react';
import { profileDescriptionData } from '../_datas';

const editableFields = profileDescriptionData.filter(({ id }) =>
  ['nickname', 'email', 'bio'].includes(id),
);

function ProfileEditForm() {
  const [form, setForm] = useState(() =>
    Object.fromEntries(editableFields.map(({ id, value }) => [id, value])),
  );

  const handleChange = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className='flex flex-col py-4 gap-4'>
      {editableFields.map(({ id, label }) => (
        <div key={id} className='flex flex-col gap-1 px-micro'>
          <label className='text-ui-label-sm text-gray-400'>{label}</label>
          <input
            type='text'
            value={form[id]}
            onChange={(e) => handleChange(id, e.target.value)}
            placeholder='플레이스 홀더'
            className='w-full h-[42px] px-3 py-2 border border-gray-200 rounded-4 text-body-md text-gray-900 placeholder:text-gray-300 outline-none focus:border-primary-400'
          />
        </div>
      ))}
      <button className='text-ui-textbtn-lg text-gray-400'>
        회원 탈퇴
      </button>
    </div>
  );
}

export default ProfileEditForm;
