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
import { useAppText } from '@/i18n/state/client';
import FieldsetPhotoChooser from '@/photo/form/FieldsetPhotoChooser';
import { ABOUT_DESCRIPTION_DEFAULT } from '@/app/config';

export default function AdminAboutEditPage({
  about,
  photoAvatar,
  photoHero,
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
            id="photoIdAvatar"
            label="Avatar"
            value={aboutForm?.photoIdAvatar ?? photoAvatar?.id ?? ''}
            onChange={photoIdAvatar => setAboutForm(form =>
              ({ ...form, photoIdAvatar }))}
            photo={photoAvatar}
            photos={photos}
            photosCount={photosCount}
            photosFavs={photosFavs}
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
            placeholder={ABOUT_DESCRIPTION_DEFAULT}
            onChange={description => setAboutForm(form =>
              ({ ...form, description }))}
          />
          <FieldsetPhotoChooser
            id="photoIdHero"
            label="Hero"
            value={aboutForm?.photoIdHero || photoHero?.id || ''}
            onChange={photoIdHero => setAboutForm(form =>
              ({ ...form, photoIdHero }))}
            photo={photoHero}
            photos={photos}
            photosCount={photosCount}
            photosFavs={photosFavs}
          />
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
