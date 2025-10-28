'use cache';

import { getUniqueTags } from '@/photo/query';
import AdminBatchEditPanelClient from './AdminBatchEditPanelClient';
import { getAlbumsWithMeta } from '@/album/query';

export default async function AdminBatchEditPanel({
  onBatchActionComplete,
}: {
  onBatchActionComplete?: () => Promise<void>
}) {
  const uniqueAlbums = await getAlbumsWithMeta().catch(() => []);
  const uniqueTags = await getUniqueTags().catch(() => []);
  return (
    <AdminBatchEditPanelClient {...{
      uniqueAlbums,
      uniqueTags,
      onBatchActionComplete,
    }} />
  );
}
