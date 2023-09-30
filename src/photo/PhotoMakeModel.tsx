import { Photo } from '.';
import { AiFillApple } from 'react-icons/ai';
import { cc } from '@/utility/css';

export default function PhotoMakeModel({
  photo,
}: {
  photo: Photo
}) {
  return (
    <div className={cc(
      'inline-flex items-center self-start',
      'uppercase',
    )}>
      {photo.make === 'Apple'
        ? <AiFillApple className="translate-y-[-0.5px]" />
        : photo.make}
      &nbsp;
      {photo.model}
    </div>
  );
}
