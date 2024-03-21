'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_UPLOADS } from '@/site/paths';
import { PhotoFormData } from './form';
import { Tags } from '@/tag';
import PhotoForm from './form/PhotoForm';
import usePhotoFormParent from './form/usePhotoFormParent';
import AiButton from './ai/AiButton';

export default function UploadPageClient({
  blobId,
  photoFormExif,
  uniqueTags,
  hasAiTextGeneration,
}: {
  blobId?: string
  photoFormExif: Partial<PhotoFormData>
  uniqueTags: Tags
  hasAiTextGeneration: boolean
}) {
  const {
    pending,
    setIsPending,
    updatedTitle,
    setUpdatedTitle,
    hasTextContent,
    setHasTextContent,
    aiContent,
  } = usePhotoFormParent({ shouldAutoGenerateText: hasAiTextGeneration });

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_UPLOADS}
      backLabel="Uploads"
      breadcrumb={pending && updatedTitle
        ? updatedTitle
        : blobId}
      breadcrumbEllipsis
      accessory={hasAiTextGeneration &&
        <AiButton {...{ aiContent, shouldConfirm: hasTextContent }} />}
      isLoading={pending}
    >
      <PhotoForm
        initialPhotoForm={photoFormExif}
        uniqueTags={uniqueTags}
        aiContent={hasAiTextGeneration ? aiContent : undefined}
        onTitleChange={setUpdatedTitle}
        onTextContentChange={setHasTextContent}
        onFormStatusChange={setIsPending}
      />
    </AdminChildPage>
  );
}
