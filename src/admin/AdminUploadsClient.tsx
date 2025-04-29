'use client';

import { StorageListItem, StorageListResponse } from '@/platforms/storage';
import AdminBatchUploadActions from './AdminBatchUploadActions';
import { useMemo, useState } from 'react';
import { Tags } from '@/tag';
import AdminUploadsTable from './AdminUploadsTable';

export type UrlAddStatus = StorageListItem & {
  status?: 'waiting' | 'adding' | 'added'
  statusMessage?: string
  progress?: number
};

export default function AdminUploadsClient({
  urls,
  uniqueTags,
}: {
  urls: StorageListResponse
  uniqueTags?: Tags
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [urlAddStatuses, setUrlAddStatuses] = useState<UrlAddStatus[]>(urls);
  const storageUrls = useMemo(() => urls.map(({ url }) => url), [urls]);

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="space-y-4">
      {(urls.length > 1 || isAdding) &&
        <AdminBatchUploadActions {...{
          storageUrls,
          uniqueTags,
          isAdding,
          setIsAdding,
          setUrlAddStatuses,
          isDeleting,
          setIsDeleting,
        }} />}
      <AdminUploadsTable {...{
        isAdding,
        urlAddStatuses,
        setUrlAddStatuses,
        isDeleting,
        setIsDeleting,
      }} />
    </div>
  );
}
