import { pathForLens } from '@/app/paths';
import { Lens, formatLensText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import IconLens from '@/components/icons/IconLens';

export default function PhotoLens({
  lens,
  countOnHover,
  shortText,
  ...props
}: {
  lens: Lens
  countOnHover?: number
  shortText?: boolean
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={formatLensText(lens, shortText ? 'short' : 'medium')}
      href={pathForLens(lens)}
      icon={<IconLens
        size={14}
        className="translate-x-[-0.5px]"
      />}
      hoverEntity={countOnHover}
    />
  );
}
