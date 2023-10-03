import { AiFillApple } from 'react-icons/ai';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { pathForDevice } from '@/site/paths';
import { IoMdCamera } from 'react-icons/io';
import { Device } from '.';

export default function PhotoDevice({
  device,
  showIcon = true,
  hideApple = true,
}: {
  device: Device
  showIcon?: boolean
  hideApple?: boolean
}) {
  return (
    <Link
      href={pathForDevice(device)}
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
      {!(hideApple && device.make?.toLowerCase() === 'apple') &&
        <>
          {device.make?.toLowerCase() === 'apple'
            ? <AiFillApple
              title="Apple"
              className="translate-y-[-0.5px]"
              size={14}
            />
            : device.make}
          &nbsp;
        </>}
      {device.model}
    </Link>
  );
}
