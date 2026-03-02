'use client';

import { useAtom, useAtomValue } from 'jotai';
import { Input } from '@/shared/ui/input';
import {
  bouquetNameAtom,
  bouquetOccasionAtom,
  bouquetRecipientAtom,
  bouquetMessageAtom,
} from '../_model';
import { bouquetNameErrorAtom } from '../_model/bouquet-form.derived';
import { MAKE_BOUQUET_INFO_DATAS } from '../_datas';
import type { PrimitiveAtom } from 'jotai';

const FIELD_ATOMS: PrimitiveAtom<string>[] = [
  bouquetNameAtom,
  bouquetOccasionAtom,
  bouquetRecipientAtom,
  bouquetMessageAtom,
];

function BouquetInfoField({
  title,
  placeholder,
  isRequired,
  fieldAtom,
}: {
  title: string;
  placeholder: string;
  isRequired: boolean;
  fieldAtom: PrimitiveAtom<string>;
}) {
  const [value, setValue] = useAtom(fieldAtom);
  const nameError = useAtomValue(bouquetNameErrorAtom);
  const showError = isRequired && value.length > 0 && nameError !== null;

  return (
    <div>
      <div>
        <span className='text-body-lg'>{title}</span>
        {isRequired && <span className='text-body-lg text-[#E86653]'>*</span>}
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className='mt-2 w-full py-2 px-3 rounded-4 border-1 border-gray-100'
      />
      {showError && (
        <p className='mx-micro mt-2 text-body-xsm text-[#E86652]'>
          {nameError}
        </p>
      )}
    </div>
  );
}

export default function MakeBouquetInfoContainer() {
  return (
    <div className='p-4 border-1 border-gray-100 rounded-5 bg-white'>
      <p className='text-title-md px-micro'>꽃다발 정보</p>
      <div className='flex flex-col gap-4 mt-3 px-micro'>
        {MAKE_BOUQUET_INFO_DATAS.map(({ title, placeholder, isRequired }, index) => (
          <BouquetInfoField
            key={title}
            title={title}
            placeholder={placeholder}
            isRequired={isRequired}
            fieldAtom={FIELD_ATOMS[index]}
          />
        ))}
      </div>
    </div>
  );
}
