import { PREFIX_RECENTS, pathForRecentsImage } from '@/app/paths';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/primitives/EntityLink';
import { useAppText } from '@/i18n/state/client';
import { photoQuantityText } from '@/photo';
import IconRecents from '@/components/icons/IconRecents';

export default function PhotoRecents({
  countOnHover,
  ...props
}: {
  countOnHover?: number
} & EntityLinkExternalProps) {
  const appText = useAppText();

  return (
    <EntityLink
      {...props}
      label={appText.category.recentPlural}
      path={PREFIX_RECENTS}
      tooltipImagePath={pathForRecentsImage()}
      tooltipCaption={countOnHover &&
        photoQuantityText(countOnHover, appText, false)}
      icon={<IconRecents size={16} />}
      iconBadge={<IconRecents size={10} solid />}
      hoverEntity={countOnHover}
    />
  );
} 