'use client';

import { pathForFocalLength, pathForFocalLengthImage } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { formatFocalLength } from '.';
import IconFocalLength from '@/components/icons/IconFocalLength';
import { useAppText } from '@/i18n/state/client';
import { photoQuantityText } from '@/photo';

export default function PhotoFocalLength({
  focal,
  countOnHover,
  ...props
}: {
  focal: number
  countOnHover?: number
} & EntityLinkExternalProps) {
  const appText = useAppText();

  return (
    <EntityLink
      {...props}
      label={formatFocalLength(focal)}
      path={pathForFocalLength(focal)}
      tooltipImagePath={pathForFocalLengthImage(focal)}
      tooltipCaption={countOnHover &&
        photoQuantityText(countOnHover, appText, false)}
      icon={<IconFocalLength className="translate-y-[-1px]" />}
      hoverEntity={countOnHover}
    />
  );
}
