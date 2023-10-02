import { AiFillApple } from 'react-icons/ai';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { pathForDevice } from '@/site/paths';
import { IoMdCamera } from 'react-icons/io';

export default function PhotoDevice({
  make,
  model,
  showIcon = true,
  hideApple = true,
}: {
  make?: string
  model?: string
  showIcon?: boolean
  hideApple?: boolean
}) {
  console.log({ make, model, showIcon, hideApple });
  return (
    <Link
      href={pathForDevice(make, model)}
      className={cc(
        'inline-flex items-center self-start',
        'uppercase',
      )}
    >
      {showIcon && <>
        <IoMdCamera size={13} />
        &nbsp;
      </>}
      {!(hideApple && make?.toLowerCase() === 'apple') &&
        <>
          {make?.toLowerCase() === 'apple'
            ? <AiFillApple
              title="Apple"
              className="translate-y-[-0.5px]"
              size={14}
            />
            : make}
          &nbsp;
        </>}
      {model}
    </Link>
  );
}
