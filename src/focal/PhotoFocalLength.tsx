import { pathForFocalLength } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { formatFocalLength } from '.';
import IconFocalLength from '@/components/icons/IconFocalLength';

export default function PhotoFocalLength({
  focal,
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
  className,
}: {
  focal: number
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      label={formatFocalLength(focal)}
      href={pathForFocalLength(focal)}
      icon={<IconFocalLength />}
      type={type}
      className={className}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
      hoverEntity={countOnHover}
    />
  );
}
