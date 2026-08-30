import {
  Photo,
  ogCaptionForPhoto,
  shouldShowExifDataForPhoto,
} from '../photo';
import { AiFillApple } from 'react-icons/ai';
import ImageCaption from '@/image-response/components/ImageCaption';
import ImagePhotoGrid from '@/image-response/components/ImagePhotoGrid';
import ImageContainer from '@/image-response/components/ImageContainer';
import { OG_TEXT_BOTTOM_ALIGNMENT } from '@/app/config';
import { NextImageSize } from '@/platforms/next-image';
import { isCameraMakeApple } from '@/platforms/apple';

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
  const caption = ogCaptionForPhoto(photo);

  return (
    <ImageContainer>
      <ImagePhotoGrid {...{
        photos: [photo],
        width,
        height,
        ...OG_TEXT_BOTTOM_ALIGNMENT && { imagePosition: 'top' },
      }} />
      {shouldShowExifDataForPhoto(photo) &&
        <ImageCaption {...{
          width,
          height,
          fontFamily,
          ...isCameraMakeApple(photo.make) && { icon: <AiFillApple style={{
            marginRight: height * .01,
          }} /> },
          title: caption,
        }} />}
    </ImageContainer>
  );
};
