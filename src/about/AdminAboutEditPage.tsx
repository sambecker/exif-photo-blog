'use client';

import { PATH_ABOUT } from '@/app/path';
import LinkWithStatus from '@/components/LinkWithStatus';
import { useState } from 'react';
import { About, AboutInsert } from '.';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import AdminChildPage from '@/components/AdminChildPage';
import { updateAboutAction } from './actions';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { Photo } from '@/photo';
import PhotoAvatar from '@/photo/PhotoAvatar';
import PhotoMedium from '@/photo/PhotoMedium';
import clsx from 'clsx/lite';
import useDynamicPhoto from '@/photo/useDynamicPhoto';
import { useAppText } from '@/i18n/state/client';
import FieldsetPhotoChooser from '@/photo/form/FieldsetPhotoChooser';

export default function AdminAboutEditPage({
  about,
  photoAvatar: _photoAvatar,
  photoHero: _photoHero,
  photos,
  photosCount,
  photosFavs,
}: {
  about?: About
  photoAvatar?: Photo
  photoHero?: Photo
  photos: Photo[]
  photosCount: number
  photosFavs: Photo[]
  shouldResizeImages?: boolean
}) {
  const appText = useAppText();

  const [aboutForm, setAboutForm] = useState<Partial<AboutInsert>>(about ?? {});

  const {
    photo: photoAvatar,
    isLoading: isLoadingPhotoAvatar,
  } = useDynamicPhoto({
    initialPhoto: _photoAvatar,
    photoId: aboutForm?.photoIdAvatar,
  });

  const {
    photo: photoHero,
    isLoading: isLoadingPhotoHero,
  } = useDynamicPhoto({
    initialPhoto: _photoHero,
    photoId: aboutForm?.photoIdHero,
  });

  const convertUrlToPhotoId = (url?: string) => url?.split('/').pop();

  return (
    <AdminChildPage
      backPath={PATH_ABOUT}
      backLabel="About"
      breadcrumb="Edit About Page"
    >
      <form
        className="space-y-12 mt-12"
        action={updateAboutAction}
      >
        <div className="space-y-4">
          <FieldsetPhotoChooser
            label="Avatar Photo"
            value={aboutForm?.photoIdAvatar ?? ''}
            onChange={photoIdAvatar => setAboutForm(form =>
              ({ ...form, photoIdAvatar }))}
            photo={photoAvatar}
            photos={photos}
            photosCount={photosCount}
            photosFavs={photosFavs}
          />
          <PhotoAvatar photo={photoAvatar} />
          <FieldsetWithStatus
            id="photoIdAvatar"
            label="Avatar Photo Id"
            spellCheck={false}
            value={aboutForm?.photoIdAvatar ?? ''}
            onChange={photoIdAvatar => setAboutForm(form =>
              ({ ...form, photoIdAvatar: convertUrlToPhotoId(photoIdAvatar) }))}
            loading={isLoadingPhotoAvatar}
          />
          <FieldsetWithStatus
            label="Title"
            value={aboutForm?.title ?? ''}
            placeholder={appText.about.titleDefault}
            onChange={title => setAboutForm(form =>
              ({ ...form, title }))}
          />
          <FieldsetWithStatus
            label="Subhead"
            type={!aboutForm?.title ? 'hidden' : undefined}
            value={aboutForm?.subhead ?? ''}
            onChange={subhead => setAboutForm(form =>
              ({ ...form, subhead }))}
          />
          <FieldsetWithStatus
            label="Description"
            type="textarea"
            value={aboutForm?.description ?? ''}
            onChange={description => setAboutForm(form =>
              ({ ...form, description }))}
          />
          <FieldsetWithStatus
            id="photoIdHero"
            label="Hero Photo Id"
            spellCheck={false}
            value={aboutForm?.photoIdHero ?? ''}
            onChange={photoIdHero => setAboutForm(form =>
              ({ ...form, photoIdHero: convertUrlToPhotoId(photoIdHero) }))}
            loading={isLoadingPhotoHero}
          />
          {photoHero &&
            <div className={clsx(
              'w-24 overflow-hidden rounded-md',
              'border border-medium bg-dim',
            )}>
              <PhotoMedium photo={photoHero} />
            </div>}
        </div>
        <div className="flex gap-2">
          <LinkWithStatus
            href={PATH_ABOUT}
            className="button"
          >
            Cancel
          </LinkWithStatus>
          <SubmitButtonWithStatus
            hideText="never"
            primary
          >
            Update
          </SubmitButtonWithStatus>
        </div>
      </form>
    </AdminChildPage>
  );
}
