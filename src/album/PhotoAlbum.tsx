'use client';

import { pathForAlbum } from '@/app/path';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import IconAlbum from '@/components/icons/IconAlbum';
import { Album } from '.';
import useCategoryCounts from '@/category/useCategoryCounts';

export default function PhotoAlbum({
  album,
  ...props
}: {
  album: Album
} & EntityLinkExternalProps) {
  const { getAlbumCount } = useCategoryCounts();
  return (
    <EntityLink
      {...props}
      label={album.title}
      path={pathForAlbum(album)}
      hoverQueryOptions={{ album }}
      icon={<IconAlbum className="translate-y-[-0.5px]" />}
      hoverCount={props.hoverCount ?? getAlbumCount(album)}
    />
  );
}
