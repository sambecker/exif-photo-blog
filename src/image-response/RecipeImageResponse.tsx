import type { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import type { NextImageSize } from '@/platforms/next-image';
import { formatTag } from '@/tag';
import { TbChecklist } from 'react-icons/tb';

export default function RecipeImageResponse({
  recipe,
  photos,
  width,
  height,
  fontFamily,
}: {
  recipe: string,
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
      <ImageCaption {...{
        width,
        height,
        fontFamily,
        icon: <TbChecklist
          size={height * .087}
          style={{
            transform: `translateY(${height * .003}px)`,
            marginRight: height * .02,
          }}
        />,
      }}>
        {formatTag(recipe).toLocaleUpperCase()}
      </ImageCaption>
    </ImageContainer>
  );
}
