import { Photo } from '..';
import ImageContainer from './components/ImageContainer';
import ImagePhotoGrid from './components/ImagePhotoGrid';

export default function HomeImageResponse({
  photos,
  width,
  height,
}: {
  photos: Photo[]
  width: number
  height: number
}) {
  return (
    <ImageContainer {...{ width, height }} >
      <ImagePhotoGrid
        {...{
          photos,
          width,
          height,
        }}
      />
    </ImageContainer>
  );
}
