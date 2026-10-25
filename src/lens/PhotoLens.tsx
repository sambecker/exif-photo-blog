'use client';

import { pathForLens } from '@/app/path';
import { Lens, formatLensText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import IconLens from '@/components/icons/IconLens';
import useCategoryCounts from '@/category/useCategoryCounts';

export default function PhotoLens({
  lens,
  longText,
  includeFocalLength = true,
  ...props
}: {
  lens: Lens
  longText?: boolean
  includeFocalLength?: boolean
} & EntityLinkExternalProps) {
  const { getLensCount } = useCategoryCounts();
  return (
    <EntityLink
      {...props}
      label={formatLensText(
        lens,
        longText ? 'long' : 'short',
        includeFocalLength,
      )}
      labelSmall={formatLensText(lens, 'short', includeFocalLength)}
      path={pathForLens(lens)}
      hoverQueryOptions={{ lens }}
      icon={<IconLens
        size={14}
        className="translate-x-[-0.5px]"
      />}
      hoverCount={props.hoverCount ?? getLensCount(lens)}
    />
  );
}
