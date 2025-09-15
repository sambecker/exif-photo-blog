import { NAV_TITLE } from '@/app/config';
import { Photo } from '../photo';
import ImageCaption from '@/image-response/components/ImageCaption';
import ImageContainer from '@/image-response/components/ImageContainer';
import ImagePhotoGrid from '@/image-response/components/ImagePhotoGrid';
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
        title: NAV_TITLE,
      }} />
    </ImageContainer>
  );
}
