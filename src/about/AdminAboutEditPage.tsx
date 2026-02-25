'use client';

import { PATH_ABOUT } from '@/app/path';
import AppGrid from '@/components/AppGrid';
import ImageInput from '@/components/ImageInput';
import LinkWithStatus from '@/components/LinkWithStatus';
import { Photo } from '@/photo';
import { getOptimizedPhotoUrl } from '@/photo/storage';
import clsx from 'clsx/lite';
import { useRef, useState } from 'react';
import { AboutForm } from '.';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';

export default function AdminAboutEditPage({
  photoAvatar,
  shouldResizeImages,
}: {
  photoAvatar?: Photo
  shouldResizeImages?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [aboutForm, setAboutForm] = useState<Partial<AboutForm>>({});

  const avatarUrl = getOptimizedPhotoUrl({
    imageUrl: photoAvatar?.url ?? '',
    useNextImage: true,
    size: 640,
  });

  return (
    <AppGrid contentMain={<div className={clsx(
      'space-y-8 mt-5',
    )}>
      <div className="min-h-[30rem] space-y-8">
        <div>About Page</div>
        <button
          className={clsx(
            'size-10 rounded-full overflow-auto',
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
        />
        <FieldsetWithStatus
          label="Title"
          value={aboutForm?.title ?? ''}
          onChange={value => setAboutForm(form =>
            ({ ...form, title: value ?? '' }))}
        />
        <FieldsetWithStatus
          label="Subhead"
          value={aboutForm?.subhead ?? ''}
          onChange={value => setAboutForm(form =>
            ({ ...form, subhead: value ?? '' }))}
        />
        <FieldsetWithStatus
          type="textarea"
          label="Description"
          value={aboutForm?.description ?? ''}
          onChange={value => setAboutForm(form =>
            ({ ...form, description: value ?? '' }))}
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
        >
          Done
        </LinkWithStatus>
      </div>
    </div>} />
  );
}
