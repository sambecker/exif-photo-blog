'use client';

import CameraBrand from '@/camera/CameraBrand';
import {
  CAMERA_BRANDS,
  type CameraBrand as CameraBrandName,
} from '@/camera/brand';
import FieldsetTag from '@/tag/FieldsetTag';
import AdminPage from '@/admin/AdminPage';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import IconHidden from '@/components/icons/IconHidden';
import IconLock from '@/components/icons/IconLock';
import SelectMenu from '@/components/SelectMenu';
import StatusIcon from '@/components/StatusIcon';
import clsx from 'clsx/lite';
import { useState } from 'react';
import { TINT_FOLDERS } from '@/app/config';
import { Photo } from '@/photo';
import FieldsetPhotoChooser from '@/photo/form/FieldsetPhotoChooser';
import PhotoFolder from '@/components/folder/PhotoFolder';
import type { PhotoFolderTint } from '@/components/folder';

const CAMERA_BRAND_TEXT_SIZES = [{
  className: 'text-xs',
}, {
  className: 'text-base',
}, {
  className: 'text-2xl',
}] as const;

const CAMERA_BRAND_MODELS: Record<CameraBrandName, string[]> = {
  fujifilm: ['X-T5', 'X100VI', 'X-H2S', 'GFX 100S II'],
  nikon: ['Zf', 'Z 8', 'D850', 'Z 6III'],
  canon: ['R8', 'EOS R5', 'EOS R6 Mark II', '5D Mark IV'],
  leica: ['M11', 'Q3 43', 'M11 Monochrom', 'SL3'],
  hasselblad: ['907X', 'X2D', 'X2D 100C', 'CFV 100C'],
  panasonic: ['S9', 'S5 II', 'S5 IIX', 'GH7'],
  sony: ['A7C', 'A7R V', 'A1 II', 'FX3'],
};

export default function AdminComponentPageClient({
  photo,
  photos,
  photosCount,
  photosFavs,
  photoFolders,
}: {
  photo: Photo
  photos: Photo[]
  photosCount: number
  photosFavs: Photo[]
  photoFolders: {
    photos: Photo[]
    caption: string
    maxPhotos: number
    count?: number
  }[]
}) {
  const [valuePhoto, setValuePhoto] = useState(photo?.id ?? '');

  const [value, setValue] = useState('visible');

  const [tint, setTint] = useState<PhotoFolderTint>(
    TINT_FOLDERS ? 'on' : 'off',
  );

  const [showAllTextSizes, setShowAllTextSizes] = useState(false);

  const cameraBrandTextSizes = showAllTextSizes
    ? CAMERA_BRAND_TEXT_SIZES
    : CAMERA_BRAND_TEXT_SIZES.filter(({ className }) =>
      className === 'text-base');

  return (
    <AdminPage title="Components">
      <div className="flex flex-col gap-4">
        <FieldsetWithStatus
          label="All text sizes"
          type="checkbox"
          value={showAllTextSizes ? 'true' : 'false'}
          onChange={value => setShowAllTextSizes(value === 'true')}
        />
        <div className="space-y-3">
          {cameraBrandTextSizes.map(({ className }) =>
            <div
              key={className}
              className={clsx(
                className,
                'flex flex-wrap items-baseline gap-x-5 gap-y-2',
                'uppercase',
              )}
            >
              {CAMERA_BRANDS.flatMap(brand =>
                CAMERA_BRAND_MODELS[brand].map(model =>
                  <span
                    key={`${brand}-${model}`}
                    className="whitespace-nowrap"
                  >
                    <CameraBrand brand={brand} />{model}
                  </span>))}
            </div>)}
        </div>
        <FieldsetWithStatus
          label="Color tint"
          type="checkbox"
          value={tint !== 'off' ? 'true' : 'false'}
          onChange={value => setTint(value === 'true' ? 'on' : 'off')}
        />
        <div className={clsx(
          'grid gap-3',
          'grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
        )}>
          {photoFolders.map((folder, index) =>
            <div
              key={`${folder.caption}-${index}`}
              className="w-full h-full flex items-center justify-center"
            >
              <PhotoFolder
                photos={folder.photos}
                caption={folder.caption}
                tint={tint}
                maxPhotos={folder.maxPhotos}
                count={folder.count}
              />
            </div>)}
        </div>
        <div className={clsx(
          'flex gap-1',
          // '*:inline-flex *:bg-medium *:rounded-[3px]',
        )}>
          <StatusIcon type="checked" />
          <StatusIcon type="missing" />
          <StatusIcon type="warning" />
          <StatusIcon type="optional" />
          <StatusIcon type="optional" loading />
          <StatusIcon type="optional" />
        </div>
        <div className="z-14">
          <FieldsetPhotoChooser
            label="Photo"
            photo={photo}
            photos={photos}
            photosCount={photosCount}
            photosFavs={photosFavs}
            value={valuePhoto}
            onChange={setValuePhoto}
          />
        </div>
        <div className="z-12">
          <FieldsetTag
            tags="tag-1"
            tagOptions={[{
              tag: 'Tag 1',
              count: 1,
              lastModified: new Date(),
            }, {
              tag: 'Tag 2',
              count: 1,
              lastModified: new Date(),
            }]}
            onChange={() => {}}
            onError={() => {}}
            openOnLoad={false}
          />
        </div>
        <div className="z-11">
          <FieldsetWithStatus
            label="Select"
            value="tag-1"
            selectOptions={[{
              value: 'tag-1',
              label: 'Tag 1',
            }, {
              value: 'tag-2',
              label: 'Tag 2',
            }]}
            onChange={() => {}}
          />
        </div>
        <div className="z-9">
          <SelectMenu
            name="select-menu"
            value={value}
            onChange={setValue}
            options={[{
              value: 'visible',
              accessoryStart: <IconHidden size={15} visible />,
              label: 'Always visible',
              accessoryEnd: '× 2',
              note: 'Exclude photo from core feeds',
            }, {
              value: 'hidden',
              accessoryStart: <IconHidden size={15} />,
              label: 'Hide from feeds',
              accessoryEnd: '× 2',
              note: 'Exclude photo from core feeds',
            }, {
              value: 'private',
              accessoryStart: <IconLock size={14} />,
              label: 'Private',
              accessoryEnd: '× 2',
              note: 'Exclude photo from core feeds',
            }, {
              value: 'private1',
              accessoryStart: <IconLock size={14} />,
              label: 'Private',
              accessoryEnd: '× 2',
              note: 'Exclude photo from core feeds',
            }, {
              value: 'private4',
              accessoryStart: <IconLock size={14} />,
              label: 'Private',
              accessoryEnd: '× 2',
              note: 'Exclude photo from core feeds',
            }, {
              value: 'private2',
              accessoryStart: <IconLock size={14} />,
              label: 'Private',
              accessoryEnd: '× 2',
              note: 'Exclude photo from core feeds',
            }, {
              value: 'private3',
              accessoryStart: <IconLock size={14} />,
              label: 'Private',
              accessoryEnd: '× 2',
              note: 'Exclude photo from core feeds',
            }]}
          />
        </div>
      </div>
    </AdminPage>
  );
}
