import type { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import type { NextImageSize } from '@/platforms/next-image';
import { TbCone } from 'react-icons/tb';
import { formatFocalLength } from '@/focal';

export default function FocalLengthImageResponse({
  focal,
  photos,
  width,
  height,
  fontFamily,
}: {
  focal: number,
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
        icon: <TbCone
          size={height * .075}
          style={{
            transform: `translateY(${height * .002}px) rotate(270deg)`,
            marginRight: height * .01,
          }}
        />,
        title: formatFocalLength(focal),
      }} />
    </ImageContainer>
  );
}
