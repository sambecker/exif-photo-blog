import { TAG_PRIVATE } from '.';
import { pathForTag } from '@/app/path';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import IconLock from '@/components/icons/IconLock';

export default function PhotoPrivate(props: EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={TAG_PRIVATE}
      path={pathForTag(TAG_PRIVATE)}
      icon={<IconLock
        size={15}
        className="translate-y-[-0.5px]"
        narrow
      />}
      iconBadgeEnd={<IconLock
        size={8}
        className="translate-y-[-0.5px]"
        solid
      />}
    />
  );
}
