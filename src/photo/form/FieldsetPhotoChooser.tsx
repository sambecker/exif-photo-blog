import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { altTextForPhoto, doesPhotoNeedBlurCompatibility, Photo } from '..';
import clsx from 'clsx/lite';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ImageMedium from '@/components/image/ImageMedium';
import { menuSurfaceStyles } from '@/components/primitives/surface';
import { GRID_SPACE_CLASSNAME } from '@/components';
import useDynamicPhoto from '../useDynamicPhoto';
import { IoSearch } from 'react-icons/io5';
import { useState } from 'react';

export default function FieldsetPhotoChooser({
  label,
  value,
  onChange,
  photo,
  photos = [],
}: {
  label: string
  value: string
  onChange: (value: string) => void
  photo?: Photo
  photos?: Photo[]
  photosCount?: number
  photosHidden?: Photo[]
}) {
  const [query, setQuery] = useState('');

  const {
    photo: photoAvatar,
    isLoading: isLoadingPhotoAvatar,
  } = useDynamicPhoto({
    initialPhoto: photo,
    photoId: value,
  });

  return (
    <>
      <FieldsetWithStatus {...{ label, value, onChange, type: 'hidden' }} />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="p-1.5">
            <span className={clsx(
              'flex size-[6rem]',
              'border border-medium rounded-[4px]',
              'overflow-hidden select-none active:opacity-75',
            )}>
              {photoAvatar && <ImageMedium
                src={photoAvatar.url}
                alt={altTextForPhoto(photoAvatar)}
                aspectRatio={photoAvatar.aspectRatio}
                blurDataURL={photoAvatar.blurData}
                blurCompatibilityMode={
                  doesPhotoNeedBlurCompatibility(photoAvatar)}
                className={clsx(isLoadingPhotoAvatar && 'opacity-50')}
              />}
            </span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            onCloseAutoFocus={e => e.preventDefault()}
            align="start"
            sideOffset={10}
            className={menuSurfaceStyles('z-20 px-1.5 py-1.5')}
          >
            <div className={clsx(
              GRID_SPACE_CLASSNAME,
              'w-[18rem] max-h-[20rem] rounded-[3px] overflow-y-auto',
            )}>
              <div className={clsx(
                'flex items-center gap-1',
                'text-medium text-xs font-medium uppercase tracking-wider',
                'pt-1 pb-2 px-1.5',
              )}>
                <div className="grow">
                  Choose photo
                </div>
                <IoSearch size={16} />
              </div>
              <input
                type="text"
                placeholder="Search for a photo"
                className="w-full mb-2"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <div className="grid grid-cols-3 gap-0.5">
                {photos.map(photo => (
                  <span
                    key={photo.id}
                    className={clsx(
                      'flex w-full aspect-square object-cover',
                      'overflow-hidden select-none active:opacity-75',
                    )}
                  >
                    <ImageMedium
                      src={photo.url}
                      alt={altTextForPhoto(photo)}
                      aspectRatio={photo.aspectRatio}
                      blurDataURL={photo.blurData}
                      // eslint-disable-next-line max-len
                      blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
                      onClick={() => onChange(photo.id)}
                    />
                  </span>
                ))}
              </div>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
