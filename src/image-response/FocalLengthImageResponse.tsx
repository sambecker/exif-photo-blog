import type { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import type { NextImageSize } from '@/services/next-image';
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
    <ImageContainer {...{
      width,
      height,
      ...photos.length === 0 && { background: 'black' },
    }}>
      <ImagePhotoGrid
        {...{
          photos,
          width,
          height,
        }}
      />
      <ImageCaption {...{ width, height, fontFamily }}>
        <TbCone
          size={height * .08}
          style={{
            transform: `translateY(${height * .01}px) rotate(270deg)`,
          }}
        />
        <span>{formatFocalLength(focal)}</span>
      </ImageCaption>
    </ImageContainer>
  );
}
