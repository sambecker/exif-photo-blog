import { getUniqueTagsCached } from '@/photo/cache';
import AdminBatchEditPanelClient from './AdminBatchEditPanelClient';

export default async function AdminBatchEditPanel({
  onBatchActionComplete,
}: {
  onBatchActionComplete?: () => Promise<void>
}) {
  const uniqueTags = await getUniqueTagsCached().catch(() => []);
  return (
    <AdminBatchEditPanelClient {...{ uniqueTags, onBatchActionComplete }} />
  );
}
