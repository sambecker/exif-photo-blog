import { Photo } from '..';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import {
  labelForFilmSimulation,
} from '@/vendors/fujifilm';
import PhotoFilmSimulationIcon from 
  '@/simulation/PhotoFilmSimulationIcon';
import { FilmSimulation } from '@/simulation';

export default function FilmSimulationImageResponse({
  simulation,
  photos,
  width,
  height,
  fontFamily,
}: {
  simulation: FilmSimulation,
  photos: Photo[]
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
          width,
          height,
        }}
      />
      <ImageCaption {...{ width, height, fontFamily }}>
        <PhotoFilmSimulationIcon
          simulation={simulation}
          height={40}
          style={{ marginRight: -10 }}
        />
        <span style={{ textTransform: 'uppercase' }}>
          {labelForFilmSimulation(simulation).medium}
        </span>
      </ImageCaption>
    </ImageContainer>
  );
}
