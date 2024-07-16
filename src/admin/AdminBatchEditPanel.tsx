import { getUniqueTagsCached } from '@/photo/cache';
import AdminBatchEditPanelClient from './AdminBatchEditPanelClient';

export default async function AdminBatchEditPanel() {
  const existingTags = await getUniqueTagsCached();
  return (
    <AdminBatchEditPanelClient {...{ existingTags }} />
  );
}
