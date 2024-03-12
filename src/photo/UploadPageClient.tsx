'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_UPLOADS } from '@/site/paths';
import { PhotoFormData } from './form';
import { Tags } from '@/tag';
import PhotoForm from './form/PhotoForm';
import { useState } from 'react';

export default function UploadPageClient({
  blobId,
  photoFormExif,
  uniqueTags,
}: {
  blobId?: string
  photoFormExif: Partial<PhotoFormData>
  uniqueTags: Tags
}) {
  const [pending, setIsPending] = useState(false);

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_UPLOADS}
      backLabel="Uploads"
      breadcrumb={blobId}
      isLoading={pending}
    >
      <PhotoForm
        initialPhotoForm={photoFormExif}
        uniqueTags={uniqueTags}
        onFormStatusChange={setIsPending}
      />
    </AdminChildPage>
  );
}
