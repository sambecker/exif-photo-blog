import FormWithConfirm from '@/components/FormWithConfirm';
import SiteGrid from '@/components/SiteGrid';
import { deletePhotoTagGloballyAction } from '@/photo/actions';
import { getUniqueTagsCached } from '@/cache';
import AdminGrid from '@/admin/AdminGrid';
import { Fragment } from 'react';
import DeleteButton from '@/admin/DeleteButton';

export const runtime = 'edge';

export default async function AdminPhotosPage() {
  const tags = await getUniqueTagsCached();

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminGrid>
              {tags.map(tag =>
                <Fragment key={tag}>
                  <div className="flex-grow w-full">
                    {tag}
                  </div>
                  <div />
                  <div />
                  <FormWithConfirm
                    action={deletePhotoTagGloballyAction}
                    confirmText={
                      // eslint-disable-next-line max-len
                      `Are you sure you want to remove "${tag}?" from all photos?`}
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
