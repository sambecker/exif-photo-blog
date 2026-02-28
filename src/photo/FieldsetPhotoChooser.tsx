import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { altTextForPhoto, doesPhotoNeedBlurCompatibility, Photo } from '.';
import clsx from 'clsx/lite';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ImageMedium from '@/components/image/ImageMedium';
import PhotoGridInfinite from './PhotoGridInfinite';

export default function FieldsetPhotoChooser({
  label,
  value,
  onChange,
  photo,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  photo?: Photo
}) {
  return (
    <>
      <FieldsetWithStatus {...{ label, value, onChange, type: 'hidden' }} />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="p-1.5">
            {photo && 
              <span className={clsx(
                'flex w-[8rem]',
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
            // alignOffset={-10}
            className={clsx(
              'z-20',
              'min-w-[8rem]',
              'component-surface',
              'p-1.5',
              'not-dark:shadow-lg not-dark:shadow-gray-900/10',
              'data-[side=top]:dark:shadow-[0_0px_40px_rgba(0,0,0,0.6)]',
              'data-[side=bottom]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
              'data-[side=right]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
              'data-[side=top]:animate-fade-in-from-bottom',
              'data-[side=bottom]:animate-fade-in-from-top',
              'data-[side=right]:animate-fade-in-from-top',
            )}>
            <div className={clsx(
              'w-[14rem] max-h-[20rem] rounded-[3px] overflow-y-auto',
              'space-y-1',
            )}>
              <PhotoGridInfinite
                cacheKey="photo-chooser-menu"
                initialOffset={0}
                sortBy="takenAt"
                animate={false}
              />
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}