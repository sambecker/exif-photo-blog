import { Photo } from '..';
import { formatModelShort } from '@/utility/exif';
import { AiFillApple } from 'react-icons/ai';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import { OG_TEXT_BOTTOM_ALIGNMENT } from '@/site/config';
import { NextImageSize } from '@/services/next-image';

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
  return (
    <ImageContainer {...{ width, height }}>
      <ImagePhotoGrid {...{
        photos: [photo],
        width,
        height,
        ...OG_TEXT_BOTTOM_ALIGNMENT && { imagePosition: 'top' },
      }} />
      <ImageCaption {...{ width, height, fontFamily }}>
        {photo.make === 'Apple' &&
          <div style={{ display: 'flex' }}>
            <AiFillApple />
          </div>}
        <div style={{ display: 'flex' }}>
          {formatModelShort(photo.model)}
        </div>
        <div style={{ display: 'flex' }}>
          {photo.focalLengthFormatted}
        </div>
        <div style={{ display: 'flex' }}>
          {photo.fNumberFormatted}
        </div>
        <div>
          {photo.isoFormatted}
        </div>
      </ImageCaption>
    </ImageContainer>
  );
};
