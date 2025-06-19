'use client';

import { pathForTag, pathForTagImage } from '@/app/paths';
import { formatTag } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import IconTag from '@/components/icons/IconTag';
import { useAppText } from '@/i18n/state/client';
import { photoQuantityText } from '@/photo';

export default function PhotoTag({
  tag,
  countOnHover,
  ...props
}: {
  tag: string
  countOnHover?: number
} & EntityLinkExternalProps) {
  const appText = useAppText();

  return (
    <EntityLink
      {...props}
      label={formatTag(tag)}
      path={pathForTag(tag)}
      tooltipImagePath={pathForTagImage(tag)}
      tooltipCaption={countOnHover &&
        photoQuantityText(countOnHover, appText, false)}
      icon={<IconTag size={14} className="translate-x-[0.5px]" />}
      hoverEntity={countOnHover}
    />
  );
}
