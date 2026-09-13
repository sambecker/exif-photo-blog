'use client';

import FieldsetTag from '@/tag/FieldsetTag';
import AppGrid from '@/components/AppGrid';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import IconHidden from '@/components/icons/IconHidden';
import IconLock from '@/components/icons/IconLock';
import SelectMenu from '@/components/SelectMenu';
import StatusIcon from '@/components/StatusIcon';
import clsx from 'clsx/lite';
import { useState } from 'react';
import { Photo } from '@/photo';
import FieldsetPhotoChooser from '@/photo/form/FieldsetPhotoChooser';
import PhotoFolder from '@/components/folder/PhotoFolder';

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

  const [tint, setTint] = useState(false);

  return (
    <AppGrid
      contentMain={<div className="flex flex-col gap-4">
        <FieldsetWithStatus
          label="Color tint"
          type="checkbox"
          value={tint ? 'true' : 'false'}
          onChange={value => setTint(value === 'true')}
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
      </div>}
    />
  );
}
