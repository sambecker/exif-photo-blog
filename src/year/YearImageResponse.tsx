import { Photo } from '@/photo';
import ImageCaption from '@/image-response/components/ImageCaption';
import ImagePhotoGrid from '@/image-response/components/ImagePhotoGrid';
import ImageContainer from '@/image-response/components/ImageContainer';
import { NextImageSize } from '@/platforms/next-image';
import IconYear from '@/components/icons/IconYear';

export default function YearImageResponse({
  year,
  photos,
  width,
  height,
  fontFamily,
}: {
  year: string
  photos: Photo[]
  width: NextImageSize
  height: number
  fontFamily: string
}) {
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
        icon: <IconYear
          size={height * .0725}
          style={{
            transform: `translateY(${height * .001}px)`,
            marginRight: height * .01,
          }}
        />,
        title: year,
      }} />
    </ImageContainer>
  );
}
