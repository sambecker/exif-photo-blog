import { SITE_DOMAIN_OR_TITLE } from '@/site/config';
import { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImageContainer from './components/ImageContainer';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import { NextImageSize } from '@/services/next-image';

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
    <ImageContainer {...{ width, height }} >
      <ImagePhotoGrid
        {...{
          photos,
          width,
          height,
        }}
      />
      <ImageCaption {...{ width, height, fontFamily }}>
        {SITE_DOMAIN_OR_TITLE}
      </ImageCaption>
    </ImageContainer>
  );
}
