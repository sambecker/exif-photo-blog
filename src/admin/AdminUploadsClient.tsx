'use client';

import { StorageListItem, StorageListResponse } from '@/platforms/storage';
import AdminBatchUploadActions from './AdminBatchUploadActions';
import { useEffect, useMemo, useState } from 'react';
import { Tags } from '@/tag';
import AdminUploadsTable from './AdminUploadsTable';
import { Albums } from '@/album';
import AdminPageHeader from './AdminPageHeader';
import PhotoUploadWithStatus from '@/photo/PhotoUploadWithStatus';
import { useAppText } from '@/i18n/state/client';
import { useAppState } from '@/app/AppState';
import { clsx } from 'clsx/lite';

export type UrlAddStatus = StorageListItem & {
  status?: 'waiting' | 'adding' | 'added'
  statusMessage?: string
  draftTitle?: string
  progress?: number
};

export default function AdminUploadsClient({
  urls,
  uniqueTags,
  uniqueAlbums,
  shouldResize,
  onLastUpload,
}: {
  urls: StorageListResponse
  uniqueTags: Tags
  uniqueAlbums: Albums
  shouldResize: boolean
  onLastUpload: () => Promise<void>
}) {
  const appText = useAppText();

  const { uploadState: { isUploading } } = useAppState();

  const [urlAddStatuses, setUrlAddStatuses] = useState<UrlAddStatus[]>(urls);

  useEffect(() => {
    // Overwrite local state when server state changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <AdminPageHeader
        count={urls.length}
        singular={appText.admin.upload}
        plural={appText.admin.uploadPlural}
        hideLabel={isUploading}
        accessory={<PhotoUploadWithStatus
          inputId="admin-uploads"
          shouldResize={shouldResize}
          onLastUpload={onLastUpload}
          className={clsx(
            'flex-row-reverse min-w-0',
            isUploading && 'w-full',
          )}
          primary={urlAddStatuses.length === 0}
        />}
      />
      {(urls.length > 1 || isAdding) &&
        <AdminBatchUploadActions {...{
          uploadUrls,
          uploadTitles,
          uniqueAlbums,
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
