import { Photo } from '..';
import { NextImageWidth } from '@/utility/image';
import { formatModelShort } from '@/utility/exif';
import { AiFillApple } from 'react-icons/ai';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';

export default function PhotoImageResponse({
  photo,
  width,
  height,
  fontFamily,
}: {
  photo: Photo
  width: NextImageWidth
  height: number
  fontFamily: string
}) {
  return (
    <ImageContainer {...{ width, height }}>
      <ImagePhotoGrid {...{
        photos: [photo],
        width,
        height,
        imagePosition: 'top',
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
