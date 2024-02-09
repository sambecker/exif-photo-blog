import { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import { Camera, cameraFromPhoto, formatCameraText } from '@/camera';
import { IoMdCamera } from 'react-icons/io';
import { NextImageSize } from '@/services/next-image';

export default function CameraImageResponse({
  camera: cameraProp,
  photos,
  width,
  height,
  fontFamily,
}: {
  camera: Camera
  photos: Photo[]
  width: NextImageSize
  height: number
  fontFamily: string
}) {
  const camera = cameraFromPhoto(photos[0], cameraProp);
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
        <IoMdCamera
          size={height * .09}
          style={{ transform: `translateY(${height * 0.002}px)` }}
        />
        <span style={{textTransform: 'uppercase'}}>
          {formatCameraText(camera)}
        </span>
      </ImageCaption>
    </ImageContainer>
  );
}
