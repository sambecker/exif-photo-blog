import { AnnotatedTag, FieldSetType } from '@/photo/form';
import { Album, Albums } from '.';
import { formatCount, formatCountDescriptive } from '@/utility/string';

export const ALBUM_FORM_META: {
  key: keyof Album
  label?: string
  type: FieldSetType
  required?: boolean
  readOnly?: boolean
}[] = [
  { key: 'id', type: 'hidden', readOnly: true },
  { key: 'title', type: 'text', required: true },
  { key: 'slug', type: 'text', required: true, readOnly: true },
  { key: 'subhead', type: 'text' },
  { key: 'description', type: 'textarea' },
  { key: 'locationName', label: 'location name', type: 'hidden' },
  { key: 'latitude', type: 'hidden' },
  { key: 'longitude', type: 'hidden' },
];

export const convertFormDataToAlbum = (formData: FormData): Album => {
  return {
    id: formData.get('id') as string,
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    subhead: formData.get('subhead') as string,
    description: formData.get('description') as string,
    locationName: formData.get('locationName') as string,
    latitude: formData.get('latitude')
      ? parseFloat(formData.get('latitude') as string)
      : undefined,
    longitude: formData.get('longitude')
      ? parseFloat(formData.get('longitude') as string)
      : undefined,
  };
};

export const convertAlbumsToAnnotatedTags = (
  albums: Albums = [],
): AnnotatedTag[] =>
  albums
    .sort((a, b) => a.album.title.localeCompare(b.album.title))
    .map(({ album, count }) => ({
      value: album.title,
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
    }));

export const getAlbumTitlesFromFormData = (formData: FormData) =>
  formData.get('albums')?.toString().split(',').filter(Boolean) ?? [];
