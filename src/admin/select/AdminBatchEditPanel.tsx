import { getUniqueTagsCached } from '@/photo/cache';
import { getAlbumsWithMetaCached } from '@/album/cache';
import AdminBatchEditPanelClient from './AdminBatchEditPanelClient';

export default async function AdminBatchEditPanel({
  onBatchActionComplete,
}: {
  onBatchActionComplete?: () => Promise<void>
}) {
  const uniqueAlbums = await getAlbumsWithMetaCached().catch(() => []);
  const uniqueTags = await getUniqueTagsCached().catch(() => []);
  return (
    <AdminBatchEditPanelClient {...{
      uniqueAlbums,
      uniqueTags,
      onBatchActionComplete,
    }} />
  );
}
