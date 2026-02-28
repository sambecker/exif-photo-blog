import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { altTextForPhoto, doesPhotoNeedBlurCompatibility, Photo } from '..';
import clsx from 'clsx/lite';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ImageMedium from '@/components/image/ImageMedium';
import { menuSurfaceStyles } from '@/components/primitives/surface';
import { GRID_SPACE_CLASSNAME } from '@/components';
import useDynamicPhoto from '../useDynamicPhoto';
import { IoClose, IoSearch } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import usePhotoQuery from '../usePhotoQuery';
import Spinner from '@/components/Spinner';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const [showQuery, setShowQuery] = useState(true);
  // TODO: Move query into hook
  const [query, setQuery] = useState('');
  const {
    photos: photosQuery,
    isLoading,
    reset,
  } = usePhotoQuery(query);

  const {
    photo: photoAvatar,
    isLoading: isLoadingPhotoAvatar,
  } = useDynamicPhoto({
    initialPhoto: photo,
    photoId: value,
  });

  useEffect(() => {
    if (showQuery) {
      inputRef.current?.focus();
    } else {
      reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
    }
  }, [showQuery, reset]);

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
                {isLoading
                  ? <Spinner />
                  : showQuery
                    ? <IoClose
                      size={16}
                      className="cursor-pointer"
                      onClick={() => setShowQuery(false)}
                    />
                    : <IoSearch
                      size={16}
                      className="cursor-pointer"
                      onClick={() => setShowQuery(true)}
                    />}
              </div>
              {showQuery &&
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for a photo"
                  className="block w-full m-0"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />}
              <div className={clsx(
                'grid grid-cols-3 gap-0.5',
              )}>
                {(showQuery && query ? photosQuery : photos).map(photo => (
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
                      blurCompatibilityMode={
                        doesPhotoNeedBlurCompatibility(photo)}
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
