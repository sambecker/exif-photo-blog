import { NAV_TITLE_OR_DOMAIN } from '@/app/config';
import { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImageContainer from './components/ImageContainer';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import { NextImageSize } from '@/platforms/next-image';

export default function HomeImageResponse({
  photos,
  width,
  height,
  fontFamily,
}: {
  photos: Photo[]
  width: NextImageSize
  height: number
  fontFamily: string
}) {
  return (
    <ImageContainer>
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
        title: NAV_TITLE_OR_DOMAIN,
      }} />
    </ImageContainer>
  );
}
