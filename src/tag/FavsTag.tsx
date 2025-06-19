'use client';

import { TAG_FAVS } from '.';
import { pathForTag, pathForTagImage } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import IconFavs from '@/components/icons/IconFavs';
import { useAppText } from '@/i18n/state/client';
import { photoQuantityText } from '@/photo';

export default function FavsTag({
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
  className,
}: {
  countOnHover?: number
} & EntityLinkExternalProps) {
  const appText = useAppText();

  return (
    <EntityLink
      label={TAG_FAVS}
      labelComplex={badged &&
        <span className="inline-flex gap-1 items-center">
          {TAG_FAVS}
          <IconFavs
            size={10}
            className="translate-y-[-0.5px]"
            highlight
          />
        </span>}
      path={pathForTag(TAG_FAVS)}
      tooltipImagePath={pathForTagImage(TAG_FAVS)}
      tooltipCaption={countOnHover &&
        photoQuantityText(countOnHover, appText, false)}
      icon={!badged &&
        <IconFavs
          size={13}
          className="translate-x-[-0.5px] translate-y-[-0.5px]"
          highlight
        />}
      type={type}
      className={className}
      hoverEntity={countOnHover}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
    />
  );
}
