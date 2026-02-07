import IconPlace from '@/components/icons/IconPlace';
import { Place } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import { getDimensionsFromSize } from '@/utility/size';
import PlaceMap from './PlaceMap';
import SharedHover from '@/components/shared-hover/SharedHover';
import clsx from 'clsx/lite';

const { width, height } = getDimensionsFromSize(300, 16 / 9);

export default function PlaceEntity({
  place,
  ...props
}: {
  place: Place
} & EntityLinkExternalProps) {
  return (
    <SharedHover {...{
      hoverKey: place.id,
      content: <div className="relative">
        <PlaceMap {...{ place, width, height }} />
        <div className={clsx(
          'absolute bottom-2.5 left-2.5 right-2.5',
          'flex',
        )}>
          <span
            className={clsx(
              'px-1.5 py-0.5 rounded-sm',
              'text-white/90 bg-black/40 backdrop-blur-lg',
              'outline-medium shadow-sm',
              'uppercase text-[0.7rem]',
              'truncate',
            )}
          >
            {place.nameFormatted || place.name}
          </span>
        </div>
      </div>,
      className: 'inline-flex',
      width,
      height,
    }}>
      <EntityLink
        {...props}
        icon={<IconPlace
          className="text-[13px] translate-x-[2px]"
        />}
        label={place.nameFormatted || place.name}
        path={place.link}
        pathTarget="_blank"
        badged
      />
    </SharedHover>
  );
}
