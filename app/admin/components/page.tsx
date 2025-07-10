'use client';

import PhotoTagFieldset from '@/admin/PhotoTagFieldset';
import AppGrid from '@/components/AppGrid';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import IconHidden from '@/components/icons/IconHidden';
import IconLock from '@/components/icons/IconLock';
import SelectMenu from '@/components/SelectMenu';
import StatusIcon from '@/components/StatusIcon';
import clsx from 'clsx/lite';
import { useState } from 'react';

export default function ComponentsPage() {
  const [value, setValue] = useState('visible');
  return (
    <AppGrid
      contentMain={<div className="flex flex-col gap-4">
        <div className={clsx(
          'flex gap-0.5',
          '*:inline-flex *:bg-medium',
        )}>
          <StatusIcon type="checked" />
          <StatusIcon type="missing" />
          <StatusIcon type="warning" />
          <StatusIcon type="optional" />
        </div>
        <div className="z-12">
          <PhotoTagFieldset
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
        <div className="z-9 mt-12">
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
