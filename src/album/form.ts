import { FieldSetType } from '@/photo/form';
import { Album } from '.';

export const ALBUM_FORM_META: {
  key: keyof Album
  label?: string
  type: FieldSetType
  required?: boolean
  readOnly?: boolean
  hidden?: boolean
}[] = [
  { key: 'id', type: 'text', readOnly: true },
  { key: 'title', type: 'text', required: true },
  { key: 'slug', type: 'text', required: true, readOnly: true },
  { key: 'subhead', type: 'text' },
  { key: 'description', type: 'textarea' },
  { key: 'locationName', label: 'location name', type: 'text', hidden: true },
  { key: 'latitude', type: 'text', hidden: true },
  { key: 'longitude', type: 'text', hidden: true },
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
