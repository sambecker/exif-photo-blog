import { pathForAlbum } from '@/app/path';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import IconAlbum from '@/components/icons/IconAlbum';
import { Album } from '.';

export default function PhotoAlbum({
  album,
  ...props
}: {
  album: Album
} & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      label={album.title}
      path={pathForAlbum(album)}
      hoverPhotoQueryOptions={{ album }}
      icon={<IconAlbum className="translate-y-[-0.5px]" />}
    />
  );
}
