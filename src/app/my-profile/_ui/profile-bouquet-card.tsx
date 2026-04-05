import ChevronDownIcon from '@/shared/assets/icons/chevron_down.svg';

interface IProfileBouquetCardProps {
  label?: string;
  content?: string;
  canClick?: boolean;
}

function ProfileBouquetCard({ label = '', content = '', canClick = false }: IProfileBouquetCardProps) {
  return (
    <>
      <div className='flex justify-between mx-micro items-center'>
        <div className='text-title-md'>{label}</div>
        {canClick && <ChevronDownIcon className='w-[12px] h-[12px] stroke-gray-200 rotate-[-90deg] mr-[7px]' />}
      </div>
      <div className='mx-micro text-body-md mt-micro text-gray-400'>{content}</div>
    </>
  );
}

export default ProfileBouquetCard;
