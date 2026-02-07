'use client';

import { TAG_FAVS } from '.';
import { pathForTag } from '@/app/path';
import useCategoryCounts from '@/category/useCategoryCounts';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import IconFavs from '@/components/icons/IconFavs';

export default function PhotoFavs({
  badgeIconFirst,
  ...props
}: EntityLinkExternalProps & { badgeIconFirst?: boolean }) {
  const { getTagCount } = useCategoryCounts();
  return (
    <EntityLink
      {...props}
      label={TAG_FAVS}
      path={pathForTag(TAG_FAVS)}
      hoverQueryOptions={{ tag: TAG_FAVS }}
      icon={<IconFavs
        size={13}
        className="translate-x-[-0.5px] translate-y-[-0.5px]"
        highlight
      />}
      iconBadgeEnd={!badgeIconFirst && <IconFavs
        size={10}
        className="translate-y-[-0.5px]"
        highlight
      />}
      hoverCount={props.hoverCount ?? getTagCount(TAG_FAVS)}
    />
  );
}
