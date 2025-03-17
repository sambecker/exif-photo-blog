import { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import {
  Camera,
  cameraFromPhoto,
  formatCameraText,
  isCameraApple,
} from '@/camera';
import { NextImageSize } from '@/platforms/next-image';
import { AiFillApple } from 'react-icons/ai';
import IconCamera from '@/components/icons/IconCamera';

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
    <ImageContainer solidBackground={photos.length === 0}>
      <ImagePhotoGrid
        {...{
          photos,
          width,
          height,
        }}
      />
      <ImageCaption {...{
        width,
        height,
        fontFamily,
        icon: isCameraApple(camera)
          ? <AiFillApple
            size={height * .09}
            style={{
              marginRight: height * .005,
              transform: `translateY(${-height * .002}px)`,
            }}
          />
          : <IconCamera
            size={height * .09}
            style={{
              marginRight: height * .015,
              transform: `translateY(${height * .001}px)`,
            }}
          />,
        title: formatCameraText(camera).toLocaleUpperCase(),
      }} />
    </ImageContainer>
  );
}
