import { pathForFocalLength } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { formatFocalLength } from '.';
import IconFocalLength from '@/components/icons/IconFocalLength';

export default function PhotoFocalLength({
  focal,
  countOnHover,
  ...props
}: {
  focal: number
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={formatFocalLength(focal)}
      href={pathForFocalLength(focal)}
      icon={<IconFocalLength className="translate-y-[-1px]" />}
      hoverEntity={countOnHover}
    />
  );
}
