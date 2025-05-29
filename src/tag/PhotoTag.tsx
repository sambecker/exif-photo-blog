import { pathForTag } from '@/app/paths';
import { formatTag } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import IconTag from '@/components/icons/IconTag';

export default function PhotoTag({
  tag,
  countOnHover,
  ...props
}: {
  tag: string
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={formatTag(tag)}
      href={pathForTag(tag)}
      icon={<IconTag size={14} className="translate-x-[0.5px]" />}
      hoverEntity={countOnHover}
    />
  );
}
