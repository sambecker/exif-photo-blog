import { AiFillApple } from 'react-icons/ai';
import { pathForCamera } from '@/app-core/paths';
import { IoMdCamera } from 'react-icons/io';
import { Camera, formatCameraText, isCameraApple } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';

export default function PhotoCamera({
  camera,
  hideAppleIcon,
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
}: {
  camera: Camera
  hideAppleIcon?: boolean
  countOnHover?: number
} & EntityLinkExternalProps) {
  const isApple = isCameraApple(camera);
  const showAppleIcon = !hideAppleIcon && isApple;

  return (
    <EntityLink
      label={formatCameraText(camera)}
      href={pathForCamera(camera)}
      icon={showAppleIcon
        ? <AiFillApple
          title="Apple"
          className="translate-x-[-1px] translate-y-[-0.5px]"
          size={15}
        />
        : <IoMdCamera
          size={13}
          className="translate-x-[-0.5px]"
        />}
      type={type}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
      hoverEntity={countOnHover}
    />
  );
}
