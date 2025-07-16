import FormWithConfirm from '@/components/FormWithConfirm';
import { deletePhotoTagGloballyAction } from '@/photo/actions';
import AdminTable from '@/admin/AdminTable';
import { Fragment } from 'react';
import DeleteFormButton from '@/admin/DeleteFormButton';
import { photoQuantityText } from '@/photo';
import { Tags, formatTag, sortTags } from '@/tag';
import EditButton from '@/admin/EditButton';
import { pathForAdminTagEdit } from '@/app/path';
import { clsx } from 'clsx/lite';
import AdminTagBadge from './AdminTagBadge';
import { getAppText } from '@/i18n/state/server';

export default async function AdminTagTable({
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
              action={deletePhotoTagGloballyAction}
              confirmText={
                // eslint-disable-next-line max-len
                `Are you sure you want to remove "${formatTag(tag)}" from ${photoQuantityText(count, appText, false, false).toLowerCase()}?`}
            >
              <input type="hidden" name="tag" value={tag} />
              <DeleteFormButton clearLocalState />
            </FormWithConfirm>
          </div>
        </Fragment>)}
    </AdminTable>
  );
}
