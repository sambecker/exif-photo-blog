import { pathForTag } from '@/site/paths';
import { FaTag } from 'react-icons/fa';
import { formatTag } from '.';
import EntityLink, { EntityLinkExternalProps } from '@/components/EntityLink';

export default function PhotoTag({
  tag,
  type,
  badged,
  dim,
  countOnHover,
}: {
  tag: string
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      label={formatTag(tag)}
      href={pathForTag(tag)}
      icon={<FaTag
        size={11}
        className="text-icon translate-y-[5px]"
      />}
      type={type}
      badged={badged}
      dim={dim}
      hoverEntity={countOnHover}
    />
  );
}
