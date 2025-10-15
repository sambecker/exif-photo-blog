import IconPlace from '@/components/icons/IconPlace';
import { Place } from '.';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';

export default function PlaceEntity({
  location,
  ...props
}: {
  location: Place
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      icon={<IconPlace
        className="text-[13px] translate-x-[2px]"
      />}
      label={location.nameFormatted || location.name}
      path={location.link}
      pathTarget="_blank"
      badged
    />
  );
}