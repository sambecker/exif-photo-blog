'use client';

import { pathForQuery } from '@/app/path';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import IconQuery from '@/components/icons/IconQuery';

export default function PhotoQuery({
  query,
  ...props
}: {
  query: string
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={`“${query}”`}
      path={pathForQuery(query)}
      hoverQueryOptions={{ query }}
      icon={<IconQuery
        size={12} 
        className="translate-x-[2px] translate-y-[-0.5px]"
      />}
    />
  );
}
