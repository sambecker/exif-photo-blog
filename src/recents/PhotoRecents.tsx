'use client';

import { PREFIX_RECENTS } from '@/app/path';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import { useAppText } from '@/i18n/state/client';
import IconRecents from '@/components/icons/IconRecents';
import useCategoryCounts from '@/category/useCategoryCounts';

export default function PhotoRecents(props: EntityLinkExternalProps) {
  const appText = useAppText();
  const { recentsCount } = useCategoryCounts();
  return (
    <EntityLink
      {...props}
      label={appText.category.recentPlural}
      path={PREFIX_RECENTS}
      hoverQueryOptions={{ recent: true }}
      icon={<IconRecents size={16} />}
      iconBadgeStart={<IconRecents size={10} solid />}
      hoverCount={props.hoverCount ?? recentsCount}
    />
  );
}
