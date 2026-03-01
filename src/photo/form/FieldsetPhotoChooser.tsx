/* eslint-disable react-hooks/set-state-in-effect */
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import {
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
  INFINITE_SCROLL_GRID_MULTIPLE,
  Photo,
} from '..';
import clsx from 'clsx/lite';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ImageMedium from '@/components/image/ImageMedium';
import { menuSurfaceStyles } from '@/components/primitives/surface';
import { IoSearch } from 'react-icons/io5';
import { useCallback, useEffect, useRef, useState } from 'react';
import usePhotoQuery from '../usePhotoQuery';
import { BiChevronDown } from 'react-icons/bi';
import SegmentMenu from '@/components/SegmentMenu';
import IconFavs from '@/components/icons/IconFavs';
import InfinitePhotoScroll from '../InfinitePhotoScroll';

type Mode = 'all' | 'favs' | 'search';

const CLASSNAME_GRID = 'grid grid-cols-3 gap-0.5';

const renderPhoto = (photo: Photo) =>
  <ImageMedium
    src={photo.url}
    alt={altTextForPhoto(photo)}
    aspectRatio={photo.aspectRatio}
    blurDataURL={photo.blurData}
    blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
  />;

export default function FieldsetPhotoChooser({
  label,
  value,
  onChange,
  photo: _photo,
  photos = [],
  photosCount,
}: {
  label: string
  value: string
  onChange: (photoId: string) => void
  photo?: Photo
  photos: Photo[]
  photosCount: number
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [photo, setPhoto] = useState(_photo);

  const [mode, setMode] = useState<Mode>('all');

  const showQuery = mode === 'search';

  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const {
    photos: photosQuery,
    isLoading: isLoadingPhotoQuery,
    reset: resetPhotoQuery,
  } = usePhotoQuery({ query, isPrivate: true });

  const reset = useCallback((resetMenu?: boolean) => {
    resetPhotoQuery();
    setQuery('');
    if (resetMenu) { setMode('all'); }
  }, [resetPhotoQuery]);

  // Focus input on query mode
  useEffect(() => {
    if (showQuery) { inputRef.current?.focus(); }
  }, [showQuery]);

  // Reset menu when closed
  useEffect(() => {
    if (!isOpen) { reset(true); }
  }, [isOpen, reset]);

  const renderPhotoButton = (photo: Photo) =>
    <span
      key={photo.id}
      className={clsx(
        'flex w-full aspect-square object-cover',
        'overflow-hidden select-none active:opacity-75',
        'cursor-pointer',
      )}
      onClick={() => {
        setPhoto(photo);
        onChange(photo.id);
        setIsOpen(false);
      }}
    >
      {renderPhoto(photo)}
    </span>;

  return (
    <>
      <FieldsetWithStatus {...{ label, value, onChange, type: 'hidden' }} />
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <button type="button" className={clsx(
            'inline-flex flex-col p-1.5 pt-0 gap-0',
          )}>
            <span className={clsx(
              'w-full',
              'flex items-center gap-1',
              'font-sans',
              'text-xs text-medium font-medium uppercase tracking-wider',
              'py-1',
            )}>
              <span className="grow truncate text-left">
                {label}
              </span>
              <BiChevronDown size={18} />
            </span>
            <span className={clsx(
              'flex size-[6rem]',
              'border border-medium rounded-[4px]',
              'overflow-hidden select-none active:opacity-75',
            )}>
              {photo && renderPhoto(photo)}
            </span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            onCloseAutoFocus={e => e.preventDefault()}
            align="start"
            sideOffset={10}
            className={menuSurfaceStyles('z-20 rounded-2xl pb-0 overflow-auto')}
          >
            <SegmentMenu
              className="pt-1 pb-2 px-1.5"
              items={[{
                value: 'all',
              }, {
                value: 'favs',
                icon: <IconFavs size={16} />,
                iconSelected: <IconFavs size={16} highlight />,
              }, {
                value: 'search',
                icon: <IoSearch size={16} />,
                isLoading: isLoadingPhotoQuery,
              }]}
              selected={mode}
              onChange={mode => {
                setMode(mode);
                if (mode !== 'search') {
                  reset();
                }
              }}
            />
            <div className={clsx(
              'border-t border-medium',
              'p-1',
              !showQuery && 'hidden',
            )}>
              <input
                id="query"
                ref={inputRef}
                type="text"
                placeholder="Search for a photo"
                className="block w-full m-0 border-none outline-none"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className={clsx(
              'w-[18rem] max-h-[20rem] overflow-y-auto',
              'space-y-0.5',
            )}>
              <div className={CLASSNAME_GRID}>
                {(showQuery && query ? photosQuery : photos)
                  .map(photo => renderPhotoButton(photo))}
              </div>
              {!(showQuery && query) && photosCount > photos.length &&
                <InfinitePhotoScroll
                  cacheKey="photo-chooser"
                  initialOffset={photos.length}
                  itemsPerPage={INFINITE_SCROLL_GRID_MULTIPLE}
                  moreButtonClassName="mt-2"
                >
                  {({ key, photos }) => (
                    <div key={key} className={CLASSNAME_GRID}>
                      {photos.map(photo => renderPhotoButton(photo))}
                    </div>
                  )}
                </InfinitePhotoScroll>}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
