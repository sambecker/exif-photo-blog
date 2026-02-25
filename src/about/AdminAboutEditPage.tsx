'use client';

import { PATH_ABOUT } from '@/app/path';
import ImageInput from '@/components/ImageInput';
import LinkWithStatus from '@/components/LinkWithStatus';
import { getOptimizedPhotoUrl } from '@/photo/storage';
import clsx from 'clsx/lite';
import { useRef, useState } from 'react';
import { About, AboutInsert } from '.';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import AdminChildPage from '@/components/AdminChildPage';
import { updateAboutAction } from './actions';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { Photo } from '@/photo';

export default function AdminAboutEditPage({
  about,
  photoAvatar,
  shouldResizeImages,
}: {
  about?: About
  photoAvatar?: Photo
  shouldResizeImages?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [aboutForm, setAboutForm] = useState<Partial<AboutInsert>>(about ?? {});

  const avatarUrl = getOptimizedPhotoUrl({
    imageUrl: photoAvatar?.url ?? '',
    useNextImage: true,
    size: 640,
  });

  return (
    <AdminChildPage
      backPath={PATH_ABOUT}
      backLabel="About"
      breadcrumb="Edit About Page"
    >
      <form
        className="space-y-8"
        action={updateAboutAction}
      >
        <button
          className={clsx(
            'size-12 rounded-full overflow-auto',
            'active:opacity-70',
            'bg-cover bg-center bg-no-repeat bg-dim',
          )}
          onClick={() => {
            if (inputRef.current) {
              setIsUploading(true);
              inputRef.current.value = '';
              inputRef.current.click();
              inputRef.current.oncancel = () => setIsUploading(false);
            }
          }}
          style={{ backgroundImage: `url(${avatarUrl})` }}
          disabled={isUploading}
        />
        <ImageInput
          ref={inputRef}
          multiple={false}
          shouldResize={shouldResizeImages}
          hidden
        />
        <div className="space-y-3">
          <FieldsetWithStatus
            id="photoIdAvatar"
            label="Avatar Photo Id"
            value={aboutForm?.photoIdAvatar ?? ''}
            onChange={photoIdAvatar => setAboutForm(form =>
              ({ ...form, photoIdAvatar }))}
          />
          <FieldsetWithStatus
            label="Title"
            value={aboutForm?.title ?? ''}
            onChange={title => setAboutForm(form =>
              ({ ...form, title }))}
          />
          <FieldsetWithStatus
            label="Subhead"
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
            value={aboutForm?.photoIdHero ?? ''}
            onChange={photoIdHero => setAboutForm(form =>
              ({ ...form, photoIdHero }))}
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
