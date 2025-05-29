import { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
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
