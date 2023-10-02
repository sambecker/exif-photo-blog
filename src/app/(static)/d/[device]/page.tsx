import { getPhotosCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import DeviceHeader from '@/device/DeviceHeader';
import { getMakeModelFromDevice } from '@/device';
import PhotoGrid from '@/photo/PhotoGrid';
import { getUniqueDevices } from '@/services/postgres';
import { generateMetaForTag } from '@/tag';
import { Metadata } from 'next';

interface TagProps {
  params: { device: string }
}

export async function generateStaticParams() {
  const devices = await getUniqueDevices();
  return devices.map(device => ({
    params: { device },
  }));
}

export async function generateMetadata({
  params: { device },
}: TagProps): Promise<Metadata> {
  const photos = await getPhotosCached({
    device: getMakeModelFromDevice(device),
  });

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForTag(device, photos);

  return {
    title,
    openGraph: {
      title,
      description,
      images,
      url,
    },
    twitter: {
      images,
      description,
      card: 'summary_large_image',
    },
    description,
  };
}

export default async function DevicePage({ params: { device } }:TagProps) {
  const photos = await getPhotosCached({
    device: getMakeModelFromDevice(device),
  });

  // Harvest original make/model with proper spaces/slashes
  const deviceFormatted = photos.length > 0
    ? `${photos[0].make} ${photos[0].model}`
    : device;

  return (
    <SiteGrid
      key="Device Grid"
      contentMain={<div className="space-y-8 mt-4">
        <DeviceHeader device={deviceFormatted} photos={photos} />
        <PhotoGrid photos={photos} tag={deviceFormatted} />
      </div>}
    />
  );
}
