'use client';

import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { Photo } from '.';
import { useEffect, useState } from 'react';
import { AnnotatedTag } from './form';
import { useDebounce } from 'use-debounce';
import PhotoSmall from './PhotoSmall';
import { getPhotosAction } from './actions';

const convertPhotoToAnnotatedTag = (photo: Photo): AnnotatedTag => ({
  value: photo.id,
  label: photo.title,
  icon: <div className="w-[3rem] overflow-hidden rounded-[3px]">
    <PhotoSmall photo={photo} />
  </div>,
});

export default function FieldsetPhotoQuery({
  label,
  photos = [],
  value,
  onChange,
}: {
  label: string
  photos?: Photo[]
  value: string
  onChange: (value: string) => void
}) {
  const [query, setQuery] = useState('');
  const [queryDebounced] = useDebounce(query, 500);
  const [isQuerying, setIsQuerying] = useState(false);

  const [photoOptions, setPhotoOptions] = useState<AnnotatedTag[]>(photos
    .map(convertPhotoToAnnotatedTag),
  );

  useEffect(() => {
    if (queryDebounced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsQuerying(true);
      getPhotosAction({ query: queryDebounced })
        .then(photos => {
          setPhotoOptions(photos.map(convertPhotoToAnnotatedTag));
        })
        .finally(() => {
          setIsQuerying(false);
        });
    } else {
      setPhotoOptions([]);
    }
  }, [queryDebounced]);

  return (
    <FieldsetWithStatus
      label={label}
      value={value}
      onChange={onChange}
      tagOptions={photoOptions}
      tagOptionsOnInputTextChange={setQuery}
      tagOptionsLabelOverride={value =>
        photoOptions.find(option => option.value === value)?.label}
      tagOptionsAllowNewValues={false}
      tagOptionsShouldParameterize={false}
      tagOptionsLimit={1}
      loading={isQuerying}
    />
  );
}
