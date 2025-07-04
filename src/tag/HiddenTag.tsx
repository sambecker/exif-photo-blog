import { TAG_HIDDEN } from '.';
import { pathForTag } from '@/app/paths';
import IconHidden from '@/components/icons/IconHidden';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';

export default function HiddenTag(props: EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={TAG_HIDDEN}
      path={pathForTag(TAG_HIDDEN)}
      icon={<IconHidden size={16} />}
      iconBadgeEnd={<IconHidden
        size={13}
        className="translate-y-[-0.5px]"
      />}
    />
  );
}
