import { AiFillApple } from 'react-icons/ai';
import { pathForCamera } from '@/site/paths';
import { IoMdCamera } from 'react-icons/io';
import { Camera } from '.';
import EntityLink, { EntityLinkExternalProps } from '@/components/EntityLink';
import { cc } from '@/utility/css';

export default function PhotoCamera({
  camera,
  hideAppleIcon,
  type = 'icon-first',
  badged,
  dim,
  countOnHover,
}: {
  camera: Camera
  hideAppleIcon?: boolean
  countOnHover?: number
} & EntityLinkExternalProps) {
  const isCameraApple = camera.make?.toLowerCase() === 'apple';
  const showAppleIcon = !hideAppleIcon && isCameraApple;

  return (
    <EntityLink
      label={<>
        {!isCameraApple && <>{camera.make}&nbsp;</>}
        {camera.model}
      </>}
      href={pathForCamera(camera)}
      icon={showAppleIcon
        ? <AiFillApple
          title="Apple"
          className={cc(
            'text-icon',
            'translate-x-[-2.5px] translate-y-[2px]',
          )}
          size={15}
        />
        : <IoMdCamera
          size={13}
          className={cc(
            'text-icon',
            'translate-x-[-1px] translate-y-[3.5px]',
          )}
        />}
      type={showAppleIcon && isCameraApple ? 'icon-first' : type}
      badged={badged}
      dim={dim}
      hoverEntity={countOnHover}
    />
  );
}
