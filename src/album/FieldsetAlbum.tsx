import { ComponentProps } from 'react';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { Albums } from '.';
import { convertAlbumsToAnnotatedTags } from './form';

export default function FieldsetAlbum({
  albumOptions,
  ...props
}: {
  albumOptions: Albums
} & ComponentProps<typeof FieldsetWithStatus>) {
  return (
    <FieldsetWithStatus
      {...props}
      tagOptions={convertAlbumsToAnnotatedTags(albumOptions)}
      tagOptionsShouldParameterize={false}
    />
  );
}
