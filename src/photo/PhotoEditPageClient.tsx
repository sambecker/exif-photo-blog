'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { Photo } from '.';
import { PATH_ADMIN_PHOTOS } from '@/app/path';
import {
  PhotoFormData,
  convertPhotoToFormData,
} from './form';
import PhotoForm from './form/PhotoForm';
import { Tags } from '@/tag';
import AiButton from './ai/AiButton';
import usePhotoFormParent from './form/usePhotoFormParent';
import ExifCaptureButton from '@/admin/ExifCaptureButton';
import { useState } from 'react';
import { Recipes } from '@/recipe';
import { Films } from '@/film';
import { StorageListResponse } from '@/platforms/storage';
import { Albums } from '@/album';

export default function PhotoEditPageClient({
  photo,
  photoStorageUrls,
  photoAlbumTitles,
  albums,
  uniqueTags,
  uniqueRecipes,
  uniqueFilms,
  hasAiTextGeneration,
  imageThumbnailBase64,
  blurData,
}: {
  photo: Photo
  photoStorageUrls?: StorageListResponse
  photoAlbumTitles: string[]
  albums: Albums
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
    shouldConfirmAiTextGeneration,
    setShouldConfirmAiTextGeneration,
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
            <AiButton {...{
              aiContent,
              shouldConfirm: shouldConfirmAiTextGeneration,
              tooltip: 'Generate AI text for all fields',
            }} />}
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
        photoStorageUrls={photoStorageUrls}
        updatedExifData={updatedExifData}
        updatedBlurData={blurData}
        photoAlbumTitles={photoAlbumTitles}
        albums={albums}
        uniqueTags={uniqueTags}
        uniqueRecipes={uniqueRecipes}
        uniqueFilms={uniqueFilms}
        aiContent={hasAiTextGeneration ? aiContent : undefined}
        onTitleChange={setUpdatedTitle}
        onFormStatusChange={setIsPending}
        onFormDataChange={setShouldConfirmAiTextGeneration}
      />
    </AdminChildPage>
  );
};
