import { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import {
  labelForFilmSimulation,
} from '@/platforms/fujifilm';
import PhotoFilmSimulationIcon from 
  '@/simulation/PhotoFilmSimulationIcon';
import { FilmSimulation } from '@/simulation';
import { NextImageSize } from '@/platforms/next-image';

export default function FilmSimulationImageResponse({
  simulation,
  photos,
  width,
  height,
  fontFamily,
}: {
  simulation: FilmSimulation,
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
        icon: <PhotoFilmSimulationIcon
          simulation={simulation}
          height={height * .081}
          style={{ transform: `translateY(${height * .001}px)`}}
        />,
      }}>
        {labelForFilmSimulation(simulation).medium.toLocaleUpperCase()}
      </ImageCaption>
    </ImageContainer>
  );
}
