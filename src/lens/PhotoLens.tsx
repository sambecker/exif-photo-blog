import { pathForLens } from '@/app/paths';
import { Lens, formatLensText } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { RiCameraLensLine } from 'react-icons/ri';

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
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      label={formatLensText(lens, 'short')}
      href={pathForLens(lens)}
      icon={<RiCameraLensLine
        size={14}
        className="translate-x-[-0.5px] translate-y-[-0.5px]"
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
