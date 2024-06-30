'use client';

import { StorageListResponse } from '@/services/storage';
import AdminAddAllUploads from './AdminAddAllUploads';
import AdminUploadsTable from './AdminUploadsTable';
import { useState } from 'react';
import { Tags } from '@/tag';

export default function AdminUploadsClient({
  title,
  urls,
  uniqueTags,
}: {
  title?: string
  urls: StorageListResponse
  uniqueTags?: Tags
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [addedUploadUrls, setAddedUploadUrls] = useState<string[]>([]);
  return (
    <div className="space-y-4">
      {urls.length > 1 &&
        <AdminAddAllUploads
          storageUrls={urls.map(({ url }) => url)}
          uniqueTags={uniqueTags}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          setAddedUploadUrls={setAddedUploadUrls}
        />}
      <AdminUploadsTable {...{ title, urls, isAdding, addedUploadUrls }} />
    </div>
  );
}
