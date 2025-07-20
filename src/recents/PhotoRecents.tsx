import { PREFIX_RECENTS } from '@/app/path';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import { useAppText } from '@/i18n/state/client';
import IconRecents from '@/components/icons/IconRecents';

export default function PhotoRecents(props: EntityLinkExternalProps) {
  const appText = useAppText();

  return (
    <EntityLink
      {...props}
      label={appText.category.recentPlural}
      path={PREFIX_RECENTS}
      hoverPhotoQueryOptions={{ recent: true }}
      icon={<IconRecents size={16} />}
      iconBadgeStart={<IconRecents size={10} solid />}
    />
  );
}
