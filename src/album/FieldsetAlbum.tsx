import { ComponentProps, useEffect, useRef } from 'react';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { Albums } from '.';
import { convertAlbumsToAnnotatedTags } from './form';

export default function FieldsetAlbum({
  albumOptions,
  label,
  openOnLoad,
  ...props
}: {
  albumOptions: Albums
  label?: string
  openOnLoad?: boolean
} & Omit<ComponentProps<typeof FieldsetWithStatus>, 'label'>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openOnLoad) {
      const timeout = setTimeout(() => {
        ref.current?.querySelectorAll('input')[0]?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [openOnLoad]);

  return (
    <div ref={ref}>
      <FieldsetWithStatus
        {...props}
        label={label ?? 'Albums'}
        tagOptions={convertAlbumsToAnnotatedTags(albumOptions)}
        tagOptionsShouldParameterize={false}
      />
    </div>
  );
}
