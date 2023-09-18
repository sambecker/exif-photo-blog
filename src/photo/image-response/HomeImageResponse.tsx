import { Photo } from '..';
import ImageContainer from './components/ImageContainer';
import ImagePhotoGrid from './components/ImagePhotoGrid';

export default function HomeImageResponse({
  photos,
  request,
  width,
  height,
}: {
  photos: Photo[]
  request: Request
  width: number
  height: number
}) {
  return (
    <ImageContainer {...{ width, height }} >
      <ImagePhotoGrid
        {...{
          photos,
          request,
          width,
          height,
        }}
      />
    </ImageContainer>
  );
}
