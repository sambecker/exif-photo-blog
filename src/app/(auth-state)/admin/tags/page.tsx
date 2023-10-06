import FormWithConfirm from '@/components/FormWithConfirm';
import SiteGrid from '@/components/SiteGrid';
import { deletePhotoTagGloballyAction } from '@/photo/actions';
import AdminGrid from '@/admin/AdminGrid';
import { Fragment } from 'react';
import DeleteButton from '@/admin/DeleteButton';
import { photoQuantityText } from '@/photo';
import { getUniqueTagsWithCountCached } from '@/cache';

export const runtime = 'edge';

export default async function AdminPhotosPage() {
  const tags = await getUniqueTagsWithCountCached();

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminGrid>
              {tags.map(({ tag, count }) =>
                <Fragment key={tag}>
                  <div className="pr-2">
                    {tag}
                  </div>
                  <div className="text-dim">
                    {photoQuantityText(count, false)}
                  </div>
                  <div />
                  <FormWithConfirm
                    action={deletePhotoTagGloballyAction}
                    confirmText={
                      // eslint-disable-next-line max-len
                      `Are you sure you want to remove "${tag}?" from ${photoQuantityText(count, false).toLowerCase()}?`}
                  >
                    <input type="hidden" name="tag" value={tag} />
                    <DeleteButton />
                  </FormWithConfirm>
                </Fragment>)}
            </AdminGrid>
          </div>
        </div>}
    />
  );
}
