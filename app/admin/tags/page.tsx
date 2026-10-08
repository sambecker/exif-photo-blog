import EmptyState from '@/components/EmptyState';
import AdminPage from '@/admin/AdminPage';
import AdminTagsTable from '@/admin/AdminTagsTable';
import IconTag from '@/components/icons/IconTag';
import { getAppText } from '@/i18n/state/server';
import { getUniqueTags } from '@/photo/query';
import { pluralize } from '@/utility/string';

export default async function AdminTagsPage() {
  const tags = await getUniqueTags(true).catch(() => []);
  
  const appText = await getAppText();

  return (
    <AdminPage
      title={pluralize(
        tags.length,
        appText.category.tag,
        appText.category.tagPlural,
      )}
    >
      {tags.length === 0
        ? <EmptyState icon={<IconTag />}>
          <div className="max-w-xs text-center space-y-1">
            <div className="font-bold">
              No tags
            </div>
            <div className="text-dim">
              Tags can be created when uploading or editing a photo
            </div>
          </div>
        </EmptyState>
        : <AdminTagsTable {...{ tags }} />}
    </AdminPage>
  );
}
