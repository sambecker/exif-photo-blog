import FormWithConfirm from '@/components/FormWithConfirm';
import AdminTable from '@/admin/AdminTable';
import { Fragment } from 'react';
import DeleteFormButton from '@/admin/DeleteFormButton';
import EditButton from '@/admin/EditButton';
import { pathForAdminAlbumEdit } from '@/app/path';
import { clsx } from 'clsx/lite';
import { getAppText } from '@/i18n/state/server';
import { Albums, deleteAlbumConfirmationText } from '@/album';
import AdminAlbumBadge from './AdminAlbumBadge';
import { deleteAlbumFormAction } from '@/album/actions';

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
              action={deleteAlbumFormAction}
              confirmText={deleteAlbumConfirmationText(album, count, appText)}
            >
              <input type="hidden" name="album" value={album.id} />
              <DeleteFormButton clearLocalState />
            </FormWithConfirm>
          </div>
        </Fragment>)}
    </AdminTable>
  );
}
