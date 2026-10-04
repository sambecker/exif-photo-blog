import AdminPageHeader from '@/admin/AdminPageHeader';
import AdminTagsTable from '@/admin/AdminTagsTable';
import AppGrid from '@/components/AppGrid';
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
            <AdminTagsTable {...{ tags }} />
          </div>
        </div>}
    />
  );
}
