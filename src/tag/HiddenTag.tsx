import { TAG_HIDDEN } from '.';
import { pathForTag } from '@/app/paths';
import IconHidden from '@/components/icons/IconHidden';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';

export default function HiddenTag({
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
  className,
}: {
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      label={TAG_HIDDEN}
      labelComplex={badged &&
        <span className="inline-flex items-center gap-1">
          {TAG_HIDDEN}
          <IconHidden
            size={13}
            className="translate-y-[-0.5px]"
          />
        </span>}
      path={pathForTag(TAG_HIDDEN)}
      icon={!badged && <IconHidden size={16} />}
      type={type}
      className={className}
      hoverEntity={countOnHover}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
    />
  );
}
