import { AiFillApple } from 'react-icons/ai';
import { pathForCamera } from '@/app/paths';
import { Camera, formatCameraText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import IconCamera from '@/components/icons/IconCamera';
import { isCameraApple } from '@/platforms/apple';

export default function PhotoCamera({
  camera,
  hideAppleIcon,
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
  className,
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
          className="translate-x-[-0.5px] translate-y-[-1px]"
          size={16}
        />
        : <IconCamera
          size={15}
          className="translate-x-[-0.5px] translate-y-[-0.5px]"
        />}
      type={type}
      className={className}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
      hoverEntity={countOnHover}
    />
  );
}
