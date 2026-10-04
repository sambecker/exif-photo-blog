import AdminEmptyState from '@/admin/AdminEmptyState';
import AdminPageHeader from '@/admin/AdminPageHeader';
import AdminTagsTable from '@/admin/AdminTagsTable';
import AppGrid from '@/components/AppGrid';
import IconTag from '@/components/icons/IconTag';
import { getAppText } from '@/i18n/state/server';
import { getUniqueTags } from '@/photo/query';

export default async function AdminTagsPage() {
  const [tags, appText] = await Promise.all([
    getUniqueTags(true).catch(() => []),
    getAppText(),
  ]);

  return (
    <AppGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminPageHeader
              count={tags.length}
              singular={appText.category.tag}
              plural={appText.category.tagPlural}
            />
            {tags.length === 0
              ? <AdminEmptyState icon={<IconTag />}>
                <div className="max-w-xs text-center space-y-1">
                  <div className="font-bold">
                    No tags
                  </div>
                  <div className="text-dim">
                    Tags can be created when uploading or editing a photo
                  </div>
                </div>
              </AdminEmptyState>
              : <AdminTagsTable {...{ tags }} />}
          </div>
        </div>}
    />
  );
}
