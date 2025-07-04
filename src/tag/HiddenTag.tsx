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
      labelComplex={props.badged &&
        <span className="inline-flex items-center gap-1">
          {TAG_HIDDEN}
          <IconHidden
            size={13}
            className="translate-y-[-0.5px]"
          />
        </span>}
      path={pathForTag(TAG_HIDDEN)}
      icon={!props.badged && <IconHidden size={16} />}
    />
  );
}
