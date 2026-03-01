import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { altTextForPhoto, doesPhotoNeedBlurCompatibility, Photo } from '..';
import clsx from 'clsx/lite';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ImageMedium from '@/components/image/ImageMedium';
import { menuSurfaceStyles } from '@/components/primitives/surface';
import { GRID_SPACE_CLASSNAME } from '@/components';
import useDynamicPhoto from '../useDynamicPhoto';
import { IoSearch } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import usePhotoQuery from '../usePhotoQuery';
import Spinner from '@/components/Spinner';
import { BiChevronDown } from 'react-icons/bi';
import SegmentMenu from '@/components/SegmentMenu';
import IconFavs from '@/components/icons/IconFavs';
import IconLock from '@/components/icons/IconLock';

type Mode = 'all' | 'favs' | 'hidden' | 'search';

const renderPhoto = ({
  photo,
  className,
  onClick,
}: {
  photo: Photo,
  className?: string,
  onClick?: () => void,
}) =>
  <ImageMedium
    src={photo.url}
    alt={altTextForPhoto(photo)}
    aspectRatio={photo.aspectRatio}
    blurDataURL={photo.blurData}
    blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
    {...{ className, onClick }}
  />;

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
  const [mode, setMode] = useState<Mode>('all');

  const showQuery = mode === 'search';

  const inputRef = useRef<HTMLInputElement>(null);

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
          <button type="button" className="inline-flex flex-col p-1.5">
            <span className={clsx(
              'w-full',
              'flex items-center gap-1',
              'font-sans',
              'text-xs text-medium font-medium uppercase tracking-wider',
            )}>
              <span className="grow truncate text-left">
                Avatar
              </span>
              <BiChevronDown size={18} />
            </span>
            <span className={clsx(
              'flex size-[6rem]',
              'border border-medium rounded-[4px]',
              'overflow-hidden select-none active:opacity-75',
            )}>
              {photoAvatar && renderPhoto({
                photo: photoAvatar,
                className: clsx(isLoadingPhotoAvatar && 'opacity-50'),
              })}
            </span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            onCloseAutoFocus={e => e.preventDefault()}
            align="start"
            sideOffset={10}
            className={menuSurfaceStyles('z-20 px-1.5 py-1.5 rounded-2xl')}
          >
            <div className={clsx(
              GRID_SPACE_CLASSNAME,
              'w-[18rem] max-h-[20rem] rounded-xl overflow-y-auto',
            )}>
              <SegmentMenu
                className="pt-1 pb-2 px-1.5"
                items={[{
                  value: 'all',
                }, {
                  value: 'favs',
                  icon: <IconFavs size={16} />,
                  iconSelected: <IconFavs size={16} highlight />,
                }, {
                  value: 'hidden',
                  icon: <IconLock size={15} />,
                }, {
                  value: 'search',
                  icon: isLoading
                    ? <Spinner />
                    : <IoSearch size={16} />,
                }]}
                selected={mode}
                onChange={setMode}
              />
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
                    {renderPhoto({
                      photo,
                      onClick: () => onChange(photo.id),
                    })}
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
