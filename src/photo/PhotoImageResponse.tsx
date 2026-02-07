import { Photo, shouldShowExifDataForPhoto } from '../photo';
import { AiFillApple } from 'react-icons/ai';
import ImageCaption from '@/image-response/components/ImageCaption';
import ImagePhotoGrid from '@/image-response/components/ImagePhotoGrid';
import ImageContainer from '@/image-response/components/ImageContainer';
import { OG_TEXT_BOTTOM_ALIGNMENT } from '@/app/config';
import { NextImageSize } from '@/platforms/next-image';
import { cameraFromPhoto, formatCameraText } from '@/camera';

export default function PhotoImageResponse({
  photo,
  width,
  height,
  fontFamily,
  isNextImageReady = true,
}: {
  photo: Photo
  width: NextImageSize
  height: number
  fontFamily: string
  isNextImageReady: boolean
}) {
  const caption = [
    photo.model
      ? formatCameraText(cameraFromPhoto(photo), 'short')
      : undefined,
    photo.focalLengthFormatted,
    photo.fNumberFormatted,
    photo.isoFormatted,
  ]
    .join(' ')
    .trim();

  return (
    <ImageContainer>
      <ImagePhotoGrid {...{
        photos: isNextImageReady ? [photo] : [],
        width,
        height,
        ...OG_TEXT_BOTTOM_ALIGNMENT && { imagePosition: 'top' },
      }} />
      {shouldShowExifDataForPhoto(photo) &&
        <ImageCaption {...{
          width,
          height,
          fontFamily,
          ...photo.make === 'Apple' && { icon: <AiFillApple style={{
            marginRight: height * .01,
          }} /> },
          title: caption,
        }} />}
    </ImageContainer>
  );
};
