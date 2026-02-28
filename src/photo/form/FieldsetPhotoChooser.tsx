import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { altTextForPhoto, doesPhotoNeedBlurCompatibility, Photo } from '..';
import clsx from 'clsx/lite';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ImageMedium from '@/components/image/ImageMedium';
import PhotoGridInfinite from '../PhotoGridInfinite';
import { menuSurfaceStyles } from '@/components/primitives/surface';
import { GRID_SPACE_CLASSNAME } from '@/components';
import PhotoGrid from '../PhotoGrid';

export default function FieldsetPhotoChooser({
  label,
  value,
  onChange,
  photo,
  photos = [],
  photosCount,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  photo?: Photo
  photos?: Photo[]
  photosCount?: number
  photosHidden?: Photo[]
}) {
  return (
    <>
      <FieldsetWithStatus {...{ label, value, onChange, type: 'hidden' }} />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="p-1.5">
            {photo && 
              <span className={clsx(
                'flex size-[6rem]',
                'border border-medium rounded-[4px]',
                'overflow-hidden select-none active:opacity-75',
              )}>
                <ImageMedium
                  src={photo.url}
                  alt={altTextForPhoto(photo)}
                  aspectRatio={photo.aspectRatio}
                  blurDataURL={photo.blurData}
                  blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
                />
              </span>}
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
              'w-[14rem] max-h-[20rem] rounded-[3px] overflow-y-auto',
            )}>
              {photos.length > 0 &&
                <PhotoGrid {...{ photos, animate: false }} />}
              {(!photosCount || photosCount > photos.length) &&
                <PhotoGridInfinite {...{
                  cacheKey: 'photo-chooser-menu',
                  initialOffset: photos.length,
                  animate: false,
                }} />}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
