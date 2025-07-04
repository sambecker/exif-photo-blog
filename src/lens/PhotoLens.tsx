'use client';

import { pathForLens } from '@/app/paths';
import { Lens, formatLensText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import IconLens from '@/components/icons/IconLens';

export default function PhotoLens({
  lens,
  shortText,
  ...props
}: {
  lens: Lens
  shortText?: boolean
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={formatLensText(lens, shortText ? 'short' : 'medium')}
      path={pathForLens(lens)}
      hoverPhotoQueryOptions={{ lens }}
      icon={<IconLens
        size={14}
        className="translate-x-[-0.5px]"
      />}
    />
  );
}
