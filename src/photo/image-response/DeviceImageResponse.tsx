import { Photo } from '..';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import { Device, formatDevice } from '@/device';
import { IoMdCamera } from 'react-icons/io';

export default function DeviceImageResponse({
  device: deviceFromProps,
  photos,
  width,
  height,
  fontFamily,
}: {
  device: Device
  photos: Photo[]
  width: number
  height: number
  fontFamily: string
}) {
  const { make, model } = formatDevice(deviceFromProps, photos[0]);
  return (
    <ImageContainer {...{
      width,
      height,
      ...photos.length === 0 && { background: 'black' },
    }}>
      <ImagePhotoGrid
        {...{
          photos,
          width,
          height,
        }}
      />
      <ImageCaption {...{ width, height, fontFamily }}>
        <IoMdCamera size={height * .09} />
        <span style={{textTransform: 'uppercase'}}>
          {make.toLowerCase() !== 'apple' && make}
          {model}
        </span>
      </ImageCaption>
    </ImageContainer>
  );
}
