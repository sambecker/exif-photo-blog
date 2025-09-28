'use client';

import { pathForYear } from '@/app/path';
import useCategoryCounts from '@/category/useCategoryCounts';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import IconYear from '@/components/icons/IconYear';

export default function PhotoYear({
  year,
  ...props
}: {
  year: string
} & EntityLinkExternalProps) {
  const { getYearsCount } = useCategoryCounts();
  return (
    <EntityLink
      {...props}
      label={year}
      path={pathForYear(year)}
      hoverQueryOptions={{ year }}
      icon={<IconYear
        size={14}
        className="translate-x-[0.5px] translate-y-[-0.5px]"
      />}
      hoverCount={props.hoverCount ?? getYearsCount(year)}
    />
  );
}
