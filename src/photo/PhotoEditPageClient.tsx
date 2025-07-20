'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { Photo } from '.';
import { PATH_ADMIN_PHOTOS } from '@/app/path';
import { PhotoFormData, convertPhotoToFormData } from './form';
import PhotoForm from './form/PhotoForm';
import { Tags } from '@/tag';
import AiButton from './ai/AiButton';
import usePhotoFormParent from './form/usePhotoFormParent';
import ExifCaptureButton from '@/admin/ExifCaptureButton';
import { useState } from 'react';
import { Recipes } from '@/recipe';
import { Films } from '@/film';

export default function PhotoEditPageClient({
  photo,
  uniqueTags,
  uniqueRecipes,
  uniqueFilms,
  hasAiTextGeneration,
  imageThumbnailBase64,
  blurData,
}: {
  photo: Photo
  uniqueTags: Tags
  uniqueRecipes: Recipes
  uniqueFilms: Films
  hasAiTextGeneration: boolean
  imageThumbnailBase64: string
  blurData: string
}) {
  const photoForm = convertPhotoToFormData(photo);

  const {
    pending,
    setIsPending,
    updatedTitle,
    setUpdatedTitle,
    hasTextContent,
    setHasTextContent,
    aiContent,
  } = usePhotoFormParent({
    photoForm,
    imageThumbnailBase64,
  });

  const [updatedExifData, setUpdatedExifData] =
    useState<Partial<PhotoFormData>>();

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_PHOTOS}
      backLabel="Photos"
      breadcrumb={pending && updatedTitle
        ? updatedTitle
        : photo.title || photo.id}
      breadcrumbEllipsis
      accessory={
        <div className="flex gap-2">
          {hasAiTextGeneration &&
            <AiButton {...{ aiContent, shouldConfirm: hasTextContent }} />}
          <ExifCaptureButton
            photoUrl={photo.url}
            onSync={setUpdatedExifData}
          />
        </div>}
      isLoading={pending}
    >
      <PhotoForm
        type="edit"
        initialPhotoForm={photoForm}
        updatedExifData={updatedExifData}
        updatedBlurData={blurData}
        uniqueTags={uniqueTags}
        uniqueRecipes={uniqueRecipes}
        uniqueFilms={uniqueFilms}
        aiContent={hasAiTextGeneration ? aiContent : undefined}
        onTitleChange={setUpdatedTitle}
        onTextContentChange={setHasTextContent}
        onFormStatusChange={setIsPending}
      />
    </AdminChildPage>
  );
};
