'use client';

import PhotoTagFieldset from '@/admin/PhotoTagFieldset';
import AppGrid from '@/components/AppGrid';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import SelectInput from '@/components/SelectInput';
import StatusIcon from '@/components/StatusIcon';
import clsx from 'clsx/lite';
import { useState } from 'react';

export default function ComponentsPage() {
  const [value, setValue] = useState('tag-1');
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
          <FieldSetWithStatus
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
        <div className="z-10">
          <SelectInput
            value={value}
            onChange={e => setValue(e.target.value)}
            options={[{
              value: 'tag-1',
              label: 'Tag 1',
              icon: '🌟',
              note: 'Note 1',
            }, {
              value: 'tag-2',
              label: 'Tag 2',
              icon: '🌟',
              note: 'Note 2',
            }, {
              value: 'tag-3',
              label: 'Tag 3',
              icon: '🌟',
              note: 'Note 3',
            }, {
              value: 'tag-4',
              label: 'Tag 4',
              icon: '🌟',
              note: 'Note 4',
            }, {
              value: 'tag-5',
              label: 'Tag 5',
              icon: '🌟',
              note: 'Note 5',
            }]}
          />
        </div>
      </div>}
    />
  );
}
