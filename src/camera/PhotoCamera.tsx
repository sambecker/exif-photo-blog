'use client';

import { AiFillApple } from 'react-icons/ai';
import { pathForCamera } from '@/app/path';
import { Camera, formatCameraText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import IconCamera from '@/components/icons/IconCamera';
import { isCameraApple } from '@/platforms/apple';
import useCategoryCounts from '@/category/useCategoryCounts';

export default function PhotoCamera({
  camera,
  hideAppleIcon,
  ...props
}: {
  camera: Camera
  hideAppleIcon?: boolean
} & EntityLinkExternalProps) {
  const { getCameraCount } = useCategoryCounts();
  
  const isApple = isCameraApple(camera);
  const showAppleIcon = !hideAppleIcon && isApple;

  return (
    <EntityLink
      {...props}
      label={formatCameraText(camera)}
      path={pathForCamera(camera)}
      hoverQueryOptions={{ camera }}
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
      hoverCount={props.hoverCount ?? getCameraCount(camera)}
    />
  );
}
