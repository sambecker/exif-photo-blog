import { pathForAlbum } from '@/app/path';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import IconAlbum from '@/components/icons/IconAlbum';

export default function PhotoAlbum({
  title,
  slug,
  ...props
}: {
  title: string
  slug: string
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={title}
      path={pathForAlbum(slug)}
      hoverPhotoQueryOptions={{ album: slug }}
      icon={<IconAlbum
        size={12.5}
        className="translate-y-[-0.5px]"
      />}
    />
  );
}
