'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { Photo } from '.';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import {
  PhotoFormData,
  convertPhotoToFormData,
} from './form';
import PhotoForm from './form/PhotoForm';
import { useFormState } from 'react-dom';
import { areSimpleObjectsEqual } from '@/utility/object';
import IconGrSync from '@/site/IconGrSync';
import { getExifDataAction } from './actions';
import { TagsWithMeta } from '@/tag';
import AiButton from './ai/AiButton';
import usePhotoFormParent from './form/usePhotoFormParent';

export default function PhotoEditPageClient({
  photo,
  uniqueTags,
  hasAiTextGeneration,
  imageThumbnailBase64,
  blurData,
}: {
  photo: Photo
  uniqueTags: TagsWithMeta
  hasAiTextGeneration: boolean
  imageThumbnailBase64: string
  blurData: string
}) {
  const seedExifData = { url: photo.url };

  const [updatedExifData, action] = useFormState<Partial<PhotoFormData>>(
    getExifDataAction,
    seedExifData,
  );

  const hasExifDataBeenFound = !areSimpleObjectsEqual(
    updatedExifData,
    seedExifData,
  );

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
        initialPhotoForm={photoForm}
        updatedExifData={hasExifDataBeenFound
          ? updatedExifData
          : undefined}
        updatedBlurData={blurData}
        uniqueTags={uniqueTags}
        aiContent={hasAiTextGeneration ? aiContent : undefined}
        onTitleChange={setUpdatedTitle}
        onTextContentChange={setHasTextContent}
        onFormStatusChange={setIsPending}
      />
    </AdminChildPage>
  );
};
