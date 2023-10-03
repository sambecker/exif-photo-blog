import { AiFillApple } from 'react-icons/ai';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { pathForCamera } from '@/site/paths';
import { IoMdCamera } from 'react-icons/io';
import { Camera } from '.';

export default function PhotoCamera({
  camera,
  showIcon = true,
  hideApple = true,
}: {
  camera: Camera
  showIcon?: boolean
  hideApple?: boolean
}) {
  return (
    <Link
      href={pathForCamera(camera)}
      className={cc(
        'inline-flex items-center self-start',
        'uppercase',
        'hover:text-gray-900 dark:hover:text-gray-100',
      )}
    >
      {showIcon && <>
        <IoMdCamera size={13} />
        &nbsp;
      </>}
      {!(hideApple && camera.make?.toLowerCase() === 'apple') &&
        <>
          {camera.make?.toLowerCase() === 'apple'
            ? <AiFillApple
              title="Apple"
              className="translate-y-[-0.5px]"
              size={14}
            />
            : camera.make}
          &nbsp;
        </>}
      {camera.model}
    </Link>
  );
}
