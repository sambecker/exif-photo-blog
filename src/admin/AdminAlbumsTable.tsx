import FormWithConfirm from '@/components/FormWithConfirm';
import AdminTable from '@/admin/AdminTable';
import { Fragment } from 'react';
import DeleteFormButton from '@/admin/DeleteFormButton';
import { photoQuantityText } from '@/photo';
import EditButton from '@/admin/EditButton';
import { pathForAdminAlbumEdit } from '@/app/path';
import { clsx } from 'clsx/lite';
import { getAppText } from '@/i18n/state/server';
import { Albums } from '@/album';
import AdminAlbumBadge from './AdminAlbumBadge';
import { deleteAlbumAction } from '@/album/actions';

export default async function AdminAlbumsTable({
  albums,
}: {
  albums: Albums
}) {
  const appText = await getAppText();

  return (
    <AdminTable>
      {albums.map(({ album, count }) =>
        <Fragment key={album.slug}>
          <div className="pr-2 col-span-2">
            <AdminAlbumBadge {...{ album, count }} />
          </div>
          <div className={clsx(
            'flex flex-nowrap',
            'gap-2 sm:gap-3 items-center',
          )}>
            <EditButton path={pathForAdminAlbumEdit(album)} />
            <FormWithConfirm
              action={deleteAlbumAction}
              confirmText={
                // eslint-disable-next-line max-len
                `Are you sure you want to remove "${album.title}" from ${photoQuantityText(count, appText, false, false).toLowerCase()}?`}
            >
              <input type="hidden" name="album" value={album.id} />
              <DeleteFormButton clearLocalState />
            </FormWithConfirm>
          </div>
        </Fragment>)}
    </AdminTable>
  );
}
