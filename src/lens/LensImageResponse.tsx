import { Photo } from '../photo';
import ImageCaption from '@/image-response/components/ImageCaption';
import ImagePhotoGrid from '@/image-response/components/ImagePhotoGrid';
import ImageContainer from '@/image-response/components/ImageContainer';
import { NextImageSize } from '@/platforms/next-image';
import { formatLensText, Lens, lensFromPhoto } from '@/lens';
import IconLens from '@/components/icons/IconLens';

export default function LensImageResponse({
  lens: lensProp,
  photos,
  width,
  height,
  fontFamily,
}: {
  lens: Lens
  photos: Photo[]
  width: NextImageSize
  height: number
  fontFamily: string
}) {
  const lens = lensFromPhoto(photos[0], lensProp);
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
        icon: <IconLens
          size={height * .079}
          style={{
            marginRight: height * .015,
            marginTop: height * .003,
          }}
        />,
        title: formatLensText(lens).toLocaleUpperCase(),
      }} />
    </ImageContainer>
  );
}
