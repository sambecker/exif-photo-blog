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
import { MENU_SURFACE_STYLES } from '@/components/primitives/surface';
import { IoSearch } from 'react-icons/io5';
import {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import usePhotoQuery from '../usePhotoQuery';
import { BiChevronRight } from 'react-icons/bi';
import SegmentMenu from '@/components/SegmentMenu';
import IconFavs from '@/components/icons/IconFavs';
import InfinitePhotoScroll from '../InfinitePhotoScroll';
import AdminEmptyState from '@/admin/AdminEmptyState';
import { TbPhotoSearch } from 'react-icons/tb';
import { MdOutlineNoPhotography } from 'react-icons/md';

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
  photo: _photo,
  photos = [],
  photosCount,
  photosFavs,
  ...props
}: {
  photo?: Photo
  photos: Photo[]
  photosCount: number
  photosFavs: Photo[]
} & ComponentProps<typeof FieldsetWithStatus>) {
  const [isOpen, setIsOpen] = useState(false);

  const [photo, setPhoto] = useState(_photo);

  const [mode, setMode] = useState<Mode>('all');

  const showQuery = mode === 'search';

  const refContainer = useRef<HTMLDivElement>(null);
  const refInput = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const {
    photos: photosQuery,
    isLoading: isLoadingPhotoQuery,
    reset: resetPhotoQuery,
    resultsNotFound,
  } = usePhotoQuery({ query, isPrivate: true });

  const reset = useCallback((resetMenu?: boolean) => {
    resetPhotoQuery();
    setQuery('');
    if (resetMenu) { setMode('all'); }
  }, [resetPhotoQuery]);

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
        props.onChange?.(photo.id);
        setIsOpen(false);
      }}
    >
      {renderPhoto(photo)}
    </span>;

  const photosToShow = showQuery && query
    ? photosQuery
    : mode === 'favs'
      ? photosFavs : photos;

  const shouldPaginate =
    !(showQuery && query) &&
    photosCount > photos.length &&
    mode !== 'favs';

  return (
    <>
      <FieldsetWithStatus {...props} type="hidden" />
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
              'select-none',
            )}>
              <span className="grow truncate text-left">
                {props.label}
              </span>
              <BiChevronRight
                size={18}
                className={clsx(
                  'text-dim',
                  'transition-transform ',
                  isOpen && 'rotate-90',
                )}
              />
            </span>
            <span className={clsx(
              'flex size-[6rem]',
              'border border-medium rounded-[4px]',
              'overflow-hidden select-none active:opacity-75',
              'bg-extra-dim',
            )}>
              {photo
                ? renderPhoto(photo)
                : <div className="flex items-center justify-center w-full">
                  <MdOutlineNoPhotography
                    size={24}
                    className="text-dim"
                  />
                </div>}
            </span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            onCloseAutoFocus={e => e.preventDefault()}
            align="start"
            sideOffset={-80}
            className={clsx(
              MENU_SURFACE_STYLES,
              'z-20 rounded-2xl pb-0 overflow-auto',
            )}
          >
            <div className={clsx(
              'flex items-center',
              'pt-1 pb-2',
              photo
                ? 'justify-between pl-1.5 pr-3'
                : 'justify-center',
            )}>
              <SegmentMenu
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
                  } else {
                    refContainer.current?.scrollTo({ top: 0 });
                    refInput.current?.focus();
                  }
                }}
              />
              {photo && <button
                type="button"
                className={clsx(
                  'link',
                  'font-sans',
                  'text-xs text-medium font-medium uppercase tracking-wider',
                  'py-1',
                  'select-none',
                )}
                onClick={() => {
                  setPhoto(undefined);
                  props.onChange?.('');
                  setIsOpen(false);
                }}
              >
                Clear
              </button>}
            </div>
            <div
              ref={refContainer}
              className={clsx(
                'w-[18rem] h-[20rem] overflow-y-auto',
                'space-y-0.5',
              )}
            >
              <div className={clsx(
                'flex items-center transition-all overflow-hidden',
                showQuery ? 'h-12 opacity-100' : 'h-0 opacity-0',
                'border-t border-medium',
              )}>
                <div className="w-full px-0.5">
                  <input
                    id="query"
                    ref={refInput}
                    type="text"
                    placeholder="Search for a photo"
                    className="block w-full m-0 outline-none border-none"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                </div>
              </div>
              {showQuery && resultsNotFound &&
                <AdminEmptyState
                  icon={<IoSearch className="text-dim" />}
                  className="translate-y-8"
                  includeContainer={false}
                >
                  No photos found
                </AdminEmptyState>}
              {!showQuery && photosToShow.length === 0 &&
                <AdminEmptyState
                  icon={<TbPhotoSearch className="text-dim" />}
                  className="translate-y-16"
                  includeContainer={false}
                >
                  No photos
                </AdminEmptyState>}
              <div className={CLASSNAME_GRID}>
                {photosToShow.map(photo => renderPhotoButton(photo))}
              </div>
              {shouldPaginate &&
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
