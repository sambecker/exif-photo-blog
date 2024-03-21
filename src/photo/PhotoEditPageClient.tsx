'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { Photo } from '.';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { PhotoFormData, convertPhotoToFormData } from './form';
import PhotoForm from './form/PhotoForm';
import { useFormState } from 'react-dom';
import { areSimpleObjectsEqual } from '@/utility/object';
import IconGrSync from '@/site/IconGrSync';
import { getExifDataAction } from './actions';
import { Tags } from '@/tag';
import { useState } from 'react';
import useAiImageQueries from './ai/useAiImageQueries';
import { HiSparkles } from 'react-icons/hi';
import Spinner from '@/components/Spinner';

export default function PhotoEditPageClient({
  photo,
  uniqueTags,
  aiTextGeneration,
}: {
  photo: Photo
  uniqueTags: Tags
  aiTextGeneration: boolean
}) {
  const seedExifData = { url: photo.url };

  const [updatedExifData, action] = useFormState<Partial<PhotoFormData>>(
    getExifDataAction,
    seedExifData,
  );

  const [pending, setIsPending] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');

  const hasExifDataBeenFound = !areSimpleObjectsEqual(
    updatedExifData,
    seedExifData,
  );

  const aiContent = useAiImageQueries();

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_PHOTOS}
      backLabel="Photos"
      breadcrumb={pending && updatedTitle
        ? updatedTitle
        : photo.title || photo.id}
      accessory={
        <div className="flex gap-2">
          <button
            className="min-w-[3.25rem] flex justify-center"
            onClick={aiContent.request}
            disabled={!aiContent.isReady || aiContent.isLoading}
          >
            {aiContent.isLoading
              ? <Spinner />
              : <HiSparkles size={16} />}
          </button>
          <form action={action}>
            <input name="photoUrl" value={photo.url} hidden readOnly />
            <SubmitButtonWithStatus
              icon={<IconGrSync
                className="translate-y-[-1px] sm:mr-[4px]"
              />}
            >
              EXIF
            </SubmitButtonWithStatus>
          </form>
        </div>}
      isLoading={pending}
    >
      <PhotoForm
        type="edit"
        initialPhotoForm={convertPhotoToFormData(photo)}
        updatedExifData={hasExifDataBeenFound
          ? updatedExifData
          : undefined}
        uniqueTags={uniqueTags}
        aiContent={aiTextGeneration ? aiContent : undefined}
        onTitleChange={setUpdatedTitle}
        onFormStatusChange={setIsPending}
      />
    </AdminChildPage>
  );
};
