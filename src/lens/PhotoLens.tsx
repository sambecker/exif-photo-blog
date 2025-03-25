import { pathForLens } from '@/app/paths';
import { Lens, formatLensText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import IconLens from '@/components/icons/IconLens';

export default function PhotoLens({
  lens,
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
  className,
  shortText,
}: {
  lens: Lens
  countOnHover?: number
  shortText?: boolean
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      label={formatLensText(lens, shortText ? 'short' : 'medium')}
      href={pathForLens(lens)}
      icon={<IconLens
        size={14}
        className="translate-x-[-0.5px]"
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
