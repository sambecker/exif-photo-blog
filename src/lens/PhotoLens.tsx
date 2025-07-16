'use client';

import { pathForLens } from '@/app/path';
import { Lens, formatLensText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import IconLens from '@/components/icons/IconLens';

export default function PhotoLens({
  lens,
  longText,
  ...props
}: {
  lens: Lens
  longText?: boolean
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={formatLensText(lens, longText ? 'long' : 'short')}
      labelSmall={formatLensText(lens, 'short')}
      path={pathForLens(lens)}
      hoverPhotoQueryOptions={{ lens }}
      icon={<IconLens
        size={14}
        className="translate-x-[-0.5px]"
      />}
    />
  );
}
