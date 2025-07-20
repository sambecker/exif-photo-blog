'use client';

import { StorageListItem, StorageListResponse } from '@/platforms/storage';
import AdminBatchUploadActions from './AdminBatchUploadActions';
import { useEffect, useMemo, useState } from 'react';
import { Tags } from '@/tag';
import AdminUploadsTable from './AdminUploadsTable';

export type UrlAddStatus = StorageListItem & {
  status?: 'waiting' | 'adding' | 'added'
  statusMessage?: string
  draftTitle?: string
  progress?: number
};

export default function AdminUploadsClient({
  urls,
  uniqueTags,
}: {
  urls: StorageListResponse
  uniqueTags?: Tags
}) {
  const [urlAddStatuses, setUrlAddStatuses] = useState<UrlAddStatus[]>(urls);

  useEffect(() => {
    // Overwrite local state when server state changes
    setUrlAddStatuses(urls);
  }, [urls]);

  const uploadUrls = useMemo(() => urlAddStatuses
    .map(({ url }) => url), [urlAddStatuses]);
  const uploadTitles = useMemo(() => urlAddStatuses
    .map(({ draftTitle }) => draftTitle ?? ''), [urlAddStatuses]);

  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="space-y-4">
      {(urls.length > 1 || isAdding) &&
        <AdminBatchUploadActions {...{
          uploadUrls,
          uploadTitles,
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
