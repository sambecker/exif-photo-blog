import { pathForTag } from '@/app/paths';
import { formatTag } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { FiTag } from 'react-icons/fi';

export default function PhotoTag({
  tag,
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
  className,
}: {
  tag: string
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      label={formatTag(tag)}
      href={pathForTag(tag)}
      icon={<FiTag size={14} className="translate-x-[0.5px]" />}
      type={type}
      className={className}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
      hoverEntity={countOnHover}
    />
  );
}
