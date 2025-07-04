import { PREFIX_RECENTS } from '@/app/paths';
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
      hoverGetPhotoOptions={{ recent: true }}
      icon={<IconRecents size={16} />}
      iconBadge={<IconRecents size={10} solid />}
    />
  );
}
