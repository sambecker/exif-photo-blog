'use client';

import { pathForAlbum } from '@/app/path';
import EntityLink, { EntityLinkExternalProps } from
  '@/components/entity/EntityLink';
import IconAlbum from '@/components/icons/IconAlbum';
import { Album } from '.';
import useCategoryCounts from '@/category/useCategoryCounts';
import AdminAlbumMenu from './AdminAlbumMenu';
import { useAppState } from '@/app/AppState';
import { htmlToPlainText } from '@/utility/html';
import { ReactNode } from 'react';

export default function PhotoAlbum({
  album,
  label,
  showAdminMenu,
  ...props
}: {
  album: Album
  label?: ReactNode
  showAdminMenu?: boolean
} & EntityLinkExternalProps) {
  const { getAlbumCount } = useCategoryCounts();
  const { isUserSignedIn } = useAppState();
  const count = props.hoverCount ?? getAlbumCount(album);
  return (
    <EntityLink
      {...props}
      label={label ?? album.title}
      path={pathForAlbum(album)}
      hoverQueryOptions={{ album }}
      hoverDescription={album.description
        ? htmlToPlainText(album.description) || undefined
        : undefined}
      icon={<IconAlbum className="translate-y-[-0.5px]" />}
      hoverCount={props.hoverCount ?? getAlbumCount(album)}
      action={showAdminMenu && isUserSignedIn &&
        <AdminAlbumMenu {...{ album, count }} />}
    />
  );
}
