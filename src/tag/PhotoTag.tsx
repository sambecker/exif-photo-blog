'use client';

import { pathForTag } from '@/app/path';
import { formatTag } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import IconTag from '@/components/icons/IconTag';
import useCategoryCounts from '@/category/useCategoryCounts';

export default function PhotoTag({
  tag,
  ...props
}: {
  tag: string
} & EntityLinkExternalProps) {
  const { getTagCount } = useCategoryCounts();
  return (
    <EntityLink
      {...props}
      label={formatTag(tag)}
      path={pathForTag(tag)}
      hoverQueryOptions={{ tag }}
      icon={<IconTag size={14} className="translate-x-[0.5px]" />}
      hoverCount={props.hoverCount ?? getTagCount(tag)}
    />
  );
}
