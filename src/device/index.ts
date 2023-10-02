import { Photo, descriptionForPhotoSet } from '@/photo';

// Assumes no device makes ('Fujifilm,' 'Apple,' 'Canon', etc.)
// will have dashes in them
export const getMakeModelFromDevice = (device: string) => {
  const [make, model] = device.toLowerCase().split(/[-| ](.*)/s);
  return { make, model };
};

export const descriptionForDevicePhotos = (
  photos: Photo[],
  dateBased?: boolean,
) =>
  descriptionForPhotoSet(photos, 'device', dateBased);
