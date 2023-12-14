import { AiFillApple } from 'react-icons/ai';
import { pathForCamera } from '@/site/paths';
import { IoMdCamera } from 'react-icons/io';
import { Camera } from '.';
import EntityLink, { EntityLinkExternalProps } from '@/components/EntityLink';

export default function PhotoCamera({
  camera,
  hideAppleIcon = true,
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
          className="text-icon translate-y-[-0.5px]"
          size={14}
        />
        : <IoMdCamera
          size={13}
          className="text-icon translate-y-[-0.25px]"
        />}
      type={type}
      badged={badged}
      dim={dim}
      hoverEntity={countOnHover}
    />
  );
}
