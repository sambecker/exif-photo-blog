import { Photo } from '@/photo';
import { capitalizeWords, parameterize } from '@/utility/string';

export type Device = {
  make: string
  model: string
};

export const createDeviceKey = (make: string, model: string) =>
  parameterize(`${make}-${model}`);

export const titleForDevice = (
  { make, model }: Device,
  photos:Photo[],
) => [
  'Shot on',
  deviceTextFromPhoto(photos[0]) ?? capitalizeWords(`${make} ${model}`),
].join(' ');

// Assumes no device makes ('Fujifilm,' 'Apple,' 'Canon', etc.)
// will have dashes in them
export const getMakeModelFromDeviceString = (device: string): Device => {
  const [make, model] = device.toLowerCase().split(/[-| ](.*)/s);
  return { make, model };
};

// Used to harvest original make/model with proper spaces/hyphens
export const deviceTextFromPhoto = (photo?: Photo) => photo
  ? `${photo.make} ${photo.model}`
  : undefined;

export const deviceFromPhoto = (photo?: Photo): Device | undefined =>
  photo?.make && photo?.model
    ? { make: photo.make, model: photo.model }
    : undefined;

export const formatDevice = (device: Device, photo?: Photo): Device =>
  photo?.make && photo?.model
    ? { make: photo.make, model: photo.model }
    : device;
