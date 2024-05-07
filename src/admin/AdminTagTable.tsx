import FormWithConfirm from '@/components/FormWithConfirm';
import { deletePhotoTagGloballyAction } from '@/photo/actions';
import AdminTable from '@/admin/AdminTable';
import { Fragment } from 'react';
import DeleteButton from '@/admin/DeleteButton';
import { photoQuantityText } from '@/photo';
import { TagsWithMeta, formatTag, sortTagsObject } from '@/tag';
import EditButton from '@/admin/EditButton';
import { pathForAdminTagEdit } from '@/site/paths';
import { clsx } from 'clsx/lite';
import AdminTagBadge from './AdminTagBadge';

export default function AdminTagTable({
  tags,
}: {
  tags: TagsWithMeta
}) {
  return (
    <AdminTable>
      {sortTagsObject(tags).map(({ tag, count }) =>
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
                `Are you sure you want to remove "${formatTag(tag)}" from ${photoQuantityText(count, false).toLowerCase()}?`}
            >
              <input type="hidden" name="tag" value={tag} />
              <DeleteButton clearLocalState />
            </FormWithConfirm>
          </div>
        </Fragment>)}
    </AdminTable>
  );
}
