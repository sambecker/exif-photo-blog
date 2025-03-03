import { pathForTag } from '@/app/paths';
import { FaTag } from 'react-icons/fa';
import { formatTag } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';

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
      icon={<FaTag
        size={11}
        className="translate-y-[0.5px]"
      />}
      type={type}
      className={className}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
      hoverEntity={countOnHover}
    />
  );
}
