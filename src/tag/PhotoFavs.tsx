'use client';

import { TAG_FAVS } from '.';
import { pathForTag } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import IconFavs from '@/components/icons/IconFavs';

export default function PhotoFavs(props: EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={TAG_FAVS}
      path={pathForTag(TAG_FAVS)}
      hoverPhotoQueryOptions={{ tag: TAG_FAVS }}
      icon={<IconFavs
        size={13}
        className="translate-x-[-0.5px] translate-y-[-0.5px]"
        highlight
      />}
      iconBadgeEnd={<IconFavs
        size={10}
        className="translate-y-[-0.5px]"
        highlight
      />}
    />
  );
}
