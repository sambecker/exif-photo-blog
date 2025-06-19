'use client';

import { pathForLens, pathForLensImage } from '@/app/paths';
import { Lens, formatLensText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import IconLens from '@/components/icons/IconLens';
import { useAppText } from '@/i18n/state/client';
import { photoQuantityText } from '@/photo';

export default function PhotoLens({
  lens,
  countOnHover,
  shortText,
  ...props
}: {
  lens: Lens
  countOnHover?: number
  shortText?: boolean
} & EntityLinkExternalProps) {
  const appText = useAppText();

  return (
    <EntityLink
      {...props}
      label={formatLensText(lens, shortText ? 'short' : 'medium')}
      path={pathForLens(lens)}
      tooltipImagePath={pathForLensImage(lens)}
      tooltipCaption={countOnHover &&
        photoQuantityText(countOnHover, appText, false)}
      icon={<IconLens
        size={14}
        className="translate-x-[-0.5px]"
      />}
      hoverEntity={countOnHover}
    />
  );
}
