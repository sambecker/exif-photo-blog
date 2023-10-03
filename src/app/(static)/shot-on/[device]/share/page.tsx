import { getPhotosCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import { deviceFromPhoto, getMakeModelFromDeviceString } from '@/device';
import DeviceHeader from '@/device/DeviceHeader';
import DeviceShareModal from '@/device/DeviceShareModal';
import { generateMetaForDevice } from '@/device/meta';
import PhotoGrid from '@/photo/PhotoGrid';
import { getUniqueDevices } from '@/services/postgres';
import { Metadata } from 'next';

interface DeviceProps {
  params: { device: string }
}

export async function generateStaticParams() {
  const devices = await getUniqueDevices();
  return devices.map(({ deviceKey }): DeviceProps => ({
    params: { device: deviceKey },
  }));
}

export async function generateMetadata({
  params,
}: DeviceProps): Promise<Metadata> {
  const device = getMakeModelFromDeviceString(params.device);

  const photos = await getPhotosCached({ device });

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForDevice(device, photos);

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

export default async function Share({
  params,
}: {
  params: { device: string }
}) {
  const deviceFromParams = getMakeModelFromDeviceString(params.device);

  const photos = await getPhotosCached({ device: deviceFromParams });

  const device = deviceFromPhoto(photos[0]) ?? deviceFromParams;

  return <>
    <DeviceShareModal {...{ device, photos }} />
    <SiteGrid
      key="Device Grid"
      contentMain={<div className="space-y-8 mt-4">
        <DeviceHeader device={device} photos={photos} />
        <PhotoGrid photos={photos} device={device} />
      </div>}
    />
  </>;
}
