'use client';

import { PATH_ABOUT } from '@/app/path';
import ImageInput from '@/components/ImageInput';
import LinkWithStatus from '@/components/LinkWithStatus';
import { Photo } from '@/photo';
import { getOptimizedPhotoUrl } from '@/photo/storage';
import clsx from 'clsx/lite';
import { useRef, useState } from 'react';
import { AboutInsert } from '.';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import AdminChildPage from '@/components/AdminChildPage';
import { updateAboutAction } from './actions';

export default function AdminAboutEditPage({
  photoAvatar,
  shouldResizeImages,
}: {
  photoAvatar?: Photo
  shouldResizeImages?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [aboutForm, setAboutForm] = useState<Partial<AboutInsert>>({});

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
        className="min-h-[30rem] space-y-8"
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
            type="textarea"
            label="Description"
            value={aboutForm?.description ?? ''}
            onChange={description => setAboutForm(form =>
              ({ ...form, description }))}
          />
          <FieldsetWithStatus
            label="Hero Photo Id"
            note="Chosen from favorites or recents if undefined"
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
          <LinkWithStatus
            href={PATH_ABOUT}
            className="button primary"
            type="submit"
          >
            Update
          </LinkWithStatus>
        </div>
      </form>
    </AdminChildPage>
  );
}
