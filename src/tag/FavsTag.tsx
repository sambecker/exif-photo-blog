import { FaStar } from 'react-icons/fa';
import { TAG_FAVS } from '.';
import { pathForTag } from '@/app/paths';
import { clsx } from 'clsx/lite';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';

export default function FavsTag({
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
}: {
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      label={badged
        ? <span className="inline-flex gap-1 items-center">
          {TAG_FAVS}
          <FaStar
            size={10}
            className="text-amber-500 translate-y-[-0.5px]"
          />
        </span>
        : TAG_FAVS}
      href={pathForTag(TAG_FAVS)}
      icon={!badged &&
        <FaStar
          size={12}
          className={clsx(
            'text-amber-500',
            'translate-x-[-1px] translate-y-[-0.5px]',
          )}
        />}
      type={type}
      hoverEntity={countOnHover}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
    />
  );
}
