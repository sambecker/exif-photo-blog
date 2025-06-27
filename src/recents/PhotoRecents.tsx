import { pathForRecents, pathForRecentsImage } from '@/app/paths';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/primitives/EntityLink';
import { HiLightningBolt } from 'react-icons/hi';
import { useAppText } from '@/i18n/state/client';
import { photoQuantityText } from '@/photo';
import { TbBolt } from 'react-icons/tb';

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
      path={pathForRecents()}
      tooltipImagePath={pathForRecentsImage()}
      tooltipCaption={countOnHover &&
        photoQuantityText(countOnHover, appText, false)}
      icon={<TbBolt size={16} />}
      iconBadge={<HiLightningBolt size={10} />}
      hoverEntity={countOnHover}
    />
  );
} 