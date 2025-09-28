'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_UPLOADS } from '@/app/path';
import {
  PhotoFormData,
  generateTakenAtFields,
} from './form';
import PhotoForm from './form/PhotoForm';
import { Tags } from '@/tag';
import usePhotoFormParent from './form/usePhotoFormParent';
import AiButton from './ai/AiButton';
import { useMemo } from 'react';
import { Recipes } from '@/recipe';
import { Films } from '@/film';
import { Albums } from '@/album';

export default function UploadPageClient({
  blobId,
  formDataFromExif,
  albums,
  uniqueTags,
  uniqueRecipes,
  uniqueFilms,
  hasAiTextGeneration,
  imageThumbnailBase64,
  shouldStripGpsData,
}: {
  blobId?: string
  formDataFromExif: Partial<PhotoFormData>
  albums: Albums
  uniqueTags: Tags
  uniqueRecipes: Recipes
  uniqueFilms: Films
  hasAiTextGeneration?: boolean
  imageThumbnailBase64?: string
  shouldStripGpsData?: boolean
}) {
  const {
    pending,
    setIsPending,
    updatedTitle,
    setUpdatedTitle,
    shouldConfirmAiTextGeneration,
    setShouldConfirmAiTextGeneration,
    aiContent,
  } = usePhotoFormParent({
    photoForm: formDataFromExif,
    imageThumbnailBase64,
  });

  const initialPhotoForm = useMemo(() => ({
    ...formDataFromExif,
    // Generate missing dates on client to avoid timezone issues
    ...generateTakenAtFields(formDataFromExif),
  }), [formDataFromExif]);

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_UPLOADS}
      backLabel="Uploads"
      breadcrumb={pending && updatedTitle
        ? updatedTitle
        : blobId}
      breadcrumbEllipsis
      accessory={hasAiTextGeneration &&
        <AiButton {...{
          aiContent,
          shouldConfirm: shouldConfirmAiTextGeneration,
          tooltip: 'Generate AI text for all fields',
        }} />}
      isLoading={pending}
    >
      <PhotoForm
        initialPhotoForm={initialPhotoForm}
        albums={albums}
        uniqueTags={uniqueTags}
        uniqueRecipes={uniqueRecipes}
        uniqueFilms={uniqueFilms}
        aiContent={hasAiTextGeneration ? aiContent : undefined}
        shouldStripGpsData={shouldStripGpsData}
        onTitleChange={setUpdatedTitle}
        onFormStatusChange={setIsPending}
        onFormDataChange={setShouldConfirmAiTextGeneration}
      />
    </AdminChildPage>
  );
}
