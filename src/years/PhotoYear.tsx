import { pathForYear, pathForYearImage } from '@/app/paths';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/primitives/EntityLink';
import IconYear from '@/components/icons/IconYear';
import { useAppText } from '@/i18n/state/client';
import { photoQuantityText } from '@/photo';

export default function PhotoYear({
  year,
  countOnHover,
  ...props
}: {
  year: string
  countOnHover?: number
} & EntityLinkExternalProps) {
  const appText = useAppText();

  return (
    <EntityLink
      {...props}
      label={year}
      path={pathForYear(year)}
      tooltipImagePath={pathForYearImage(year)}
      tooltipCaption={countOnHover &&
        photoQuantityText(countOnHover, appText, false)}
      icon={<IconYear
        size={14}
        className="translate-x-[0.5px] translate-y-[-0.5px]"
      />}
      hoverEntity={countOnHover}
    />
  );
} 