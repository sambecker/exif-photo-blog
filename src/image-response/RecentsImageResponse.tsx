import { Photo } from '@/photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import { NextImageSize } from '@/platforms/next-image';
import IconRecents from '@/components/icons/IconRecents';

export default function RecentsImageResponse({
  title,
  photos,
  width,
  height,
  fontFamily,
}: {
  title: string
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
        icon: <IconRecents
          size={height * .08}
          style={{
            transform: `translateY(${height * .003}px)`,
            marginRight: height * .01,
          }}
        />,
        title,
      }} />
    </ImageContainer>
  );
}
