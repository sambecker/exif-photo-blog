'use client';

import { pathForFocalLength } from '@/app/path';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import { formatFocalLength } from '.';
import IconFocalLength from '@/components/icons/IconFocalLength';
import useCategoryCounts from '@/category/useCategoryCounts';

export default function PhotoFocalLength({
  focal,
  ...props
}: {
  focal: number
} & EntityLinkExternalProps) {
  const { getFocalLengthCount } = useCategoryCounts();
  return (
    <EntityLink
      {...props}
      label={formatFocalLength(focal)}
      path={pathForFocalLength(focal)}
      hoverPhotoQueryOptions={{ focal }}
      icon={<IconFocalLength className="translate-y-[-1px]" />}
      countOnHover={props.countOnHover ?? getFocalLengthCount(focal)}
    />
  );
}
