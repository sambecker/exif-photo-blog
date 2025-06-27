import { Photo } from '@/photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import { NextImageSize } from '@/platforms/next-image';
import { HiLightningBolt } from 'react-icons/hi';

export default function RecentsImageResponse({
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
        icon: <HiLightningBolt
          size={height * .0725}
          style={{
            transform: `translateY(${height * .001}px)`,
            marginRight: height * .01,
          }}
        />,
        title: 'Recents',
      }} />
    </ImageContainer>
  );
}
