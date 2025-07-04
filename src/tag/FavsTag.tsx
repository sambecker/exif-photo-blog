'use client';

import { TAG_FAVS } from '.';
import { pathForTag } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import IconFavs from '@/components/icons/IconFavs';

export default function FavsTag(props: EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={TAG_FAVS}
      labelComplex={props.badged &&
        <span className="inline-flex gap-1 items-center">
          {TAG_FAVS}
          <IconFavs
            size={10}
            className="translate-y-[-0.5px]"
            highlight
          />
        </span>}
      path={pathForTag(TAG_FAVS)}
      hoverGetPhotoOptions={{ tag: TAG_FAVS }}
      icon={!props.badged &&
        <IconFavs
          size={13}
          className="translate-x-[-0.5px] translate-y-[-0.5px]"
          highlight
        />}
    />
  );
}
