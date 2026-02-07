import { Photo } from '../photo';
import ImageCaption from '@/image-response/components/ImageCaption';
import ImagePhotoGrid from '@/image-response/components/ImagePhotoGrid';
import ImageContainer from '@/image-response/components/ImageContainer';
import PhotoFilmIcon from 
  '@/film/PhotoFilmIcon';
import { NextImageSize } from '@/platforms/next-image';
import { labelForFilm } from '@/film';

export default function FilmImageResponse({
  film,
  photos,
  width,
  height,
  fontFamily,
}: {
  film: string,
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
        icon: <PhotoFilmIcon
          film={film}
          height={height * .081}
          style={{ transform: `translateY(${height * .001}px)`}}
        />,
        title: labelForFilm(film).medium.toLocaleUpperCase(),
      }} />
    </ImageContainer>
  );
}
