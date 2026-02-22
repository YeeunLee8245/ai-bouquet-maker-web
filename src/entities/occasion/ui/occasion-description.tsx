import { TOccasion } from '../model/types';
import { OccasionImage } from './occasion-image';

interface IProps {
  type: TOccasion;
  title: string;
  description: string;
}

function OccasionDescription({ type, title, description }: IProps) {

  return <div className='h-[180px] pt-2 px-4 pb-4 flex flex-col items-center gap-[2px]'>
    <div className='flex-1 content-center'>
      <OccasionImage type={type} className='w-auto h-auto' priority />
    </div>
    <div className='text-title-lg'>{title}</div>
    <div className='text-body-md text-gray-400 text-center whitespace-pre-wrap'>{description}</div>
  </div>;
}

export default OccasionDescription;
