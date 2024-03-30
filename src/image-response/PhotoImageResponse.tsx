import { Photo, shouldShowExifDataForPhoto } from '../photo';
import { AiFillApple } from 'react-icons/ai';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import { OG_TEXT_BOTTOM_ALIGNMENT } from '@/site/config';
import { NextImageSize } from '@/services/next-image';
import { cameraFromPhoto, formatCameraModelTextShort } from '@/camera';

export default function PhotoImageResponse({
  photo,
  width,
  height,
  fontFamily,
}: {
  photo: Photo
  width: NextImageSize
  height: number
  fontFamily: string
}) {
  const model = photo.model
    ? formatCameraModelTextShort(cameraFromPhoto(photo))
    : undefined;

  return (
    <ImageContainer {...{ width, height }}>
      <ImagePhotoGrid {...{
        photos: [photo],
        width,
        height,
        ...OG_TEXT_BOTTOM_ALIGNMENT && { imagePosition: 'top' },
      }} />
      {shouldShowExifDataForPhoto(photo) &&
        <ImageCaption {...{ width, height, fontFamily }}>
          {photo.make === 'Apple' &&
            <div style={{ display: 'flex' }}>
              <AiFillApple />
            </div>}
          {model &&
            <div style={{ display: 'flex' }}>
              {model}
            </div>}
          <div style={{ display: 'flex' }}>
            {photo.focalLengthFormatted}
          </div>
          <div style={{ display: 'flex' }}>
            {photo.fNumberFormatted}
          </div>
          <div>
            {photo.isoFormatted}
          </div>
        </ImageCaption>}
    </ImageContainer>
  );
};
