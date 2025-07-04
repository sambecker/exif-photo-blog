import { pathForYear } from '@/app/paths';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import IconYear from '@/components/icons/IconYear';

export default function PhotoYear({
  year,
  ...props
}: {
  year: string
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={year}
      path={pathForYear(year)}
      hoverPhotoQueryOptions={{ year }}
      icon={<IconYear
        size={14}
        className="translate-x-[0.5px] translate-y-[-0.5px]"
      />}
    />
  );
}
