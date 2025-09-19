import FormWithConfirm from '@/components/FormWithConfirm';
import { deletePhotoTagGloballyFormAction } from '@/photo/actions';
import AdminTable from '@/admin/AdminTable';
import { Fragment } from 'react';
import DeleteFormButton from '@/admin/DeleteFormButton';
import { Tags, deleteTagConfirmationText, sortTags } from '@/tag';
import EditButton from '@/admin/EditButton';
import { pathForAdminTagEdit } from '@/app/path';
import { clsx } from 'clsx/lite';
import AdminTagBadge from './AdminTagBadge';
import { getAppText } from '@/i18n/state/server';

export default async function AdminTagsTable({
  tags,
}: {
  tags: Tags
}) {
  const appText = await getAppText();

  return (
    <AdminTable>
      {sortTags(tags).map(({ tag, count }) =>
        <Fragment key={tag}>
          <div className="pr-2 col-span-2">
            <AdminTagBadge {...{ tag, count }} />
          </div>
          <div className={clsx(
            'flex flex-nowrap',
            'gap-2 sm:gap-3 items-center',
          )}>
            <EditButton path={pathForAdminTagEdit(tag)} />
            <FormWithConfirm
              action={deletePhotoTagGloballyFormAction}
              confirmText={deleteTagConfirmationText(tag, count, appText)}
            >
              <input type="hidden" name="tag" value={tag} />
              <DeleteFormButton clearLocalState />
            </FormWithConfirm>
          </div>
        </Fragment>)}
    </AdminTable>
  );
}
