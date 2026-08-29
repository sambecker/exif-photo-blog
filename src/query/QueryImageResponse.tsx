import { Photo } from '@/photo';
import ImageCaption from '@/image-response/components/ImageCaption';
import ImagePhotoGrid from '@/image-response/components/ImagePhotoGrid';
import ImageContainer from '@/image-response/components/ImageContainer';
import { NextImageSize } from '@/platforms/next-image';
import IconQuery from '@/components/icons/IconQuery';

export default function QueryImageResponse({
  query,
  photos,
  width,
  height,
  fontFamily,
}: {
  query: string
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
        icon: <IconQuery
          size={height * .072}
          style={{
            transform: `translateY(${height * .001}px)`,
            marginRight: height * .01,
          }}
        />,
        title: `“${query.toLocaleUpperCase()}”`,
      }} />
    </ImageContainer>
  );
}
