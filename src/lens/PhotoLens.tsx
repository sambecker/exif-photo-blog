import { pathForLens } from '@/app/paths';
import { Lens, formatLensText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { TbCone } from 'react-icons/tb';

export default function PhotoLens({
  lens,
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
  className,
}: {
  lens: Lens
  hideAppleIcon?: boolean
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      label={formatLensText(lens)}
      href={pathForLens(lens)}
      icon={<TbCone
        className="rotate-[270deg] translate-x-[-1px] translate-y-[-0.5px]"
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
