import { TAG_FAVS } from '.';
import { pathForTag } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import IconFavs from '@/components/icons/IconFavs';

export default function FavsTag({
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
      label={badged
        ? <span className="inline-flex gap-1 items-center">
          {TAG_FAVS}
          <IconFavs
            size={10}
            className="translate-y-[-0.5px]"
            highlight
          />
        </span>
        : TAG_FAVS}
      href={pathForTag(TAG_FAVS)}
      icon={!badged &&
        <IconFavs
          size={13}
          className="translate-x-[-0.5px] translate-y-[-0.5px]"
          highlight
        />}
      type={type}
      className={className}
      hoverEntity={countOnHover}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
    />
  );
}
