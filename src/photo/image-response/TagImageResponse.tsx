import { Photo } from '..';
import { FaTag } from 'react-icons/fa';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';

export default function TagImageResponse({
  tag,
  photos,
  request,
  width,
  height,
  fontFamily,
}: {
  tag: string,
  photos: Photo[]
  request: Request
  width: number
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
          request,
          width,
          height,
        }}
      />
      <ImageCaption {...{ width, height, fontFamily }}>
        <FaTag
          size={height * .067}
          style={{ transform: `translateY(${height * .02}px)` }}
        />
        <span>{tag.toUpperCase()}</span>
      </ImageCaption>
    </ImageContainer>
  );
}
