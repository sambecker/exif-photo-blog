import { Photo, PhotoDateRange } from '@/photo';
import { FilmSimulation, descriptionForFilmPhotos } from '.';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoFilm from '@/film/PhotoFilm';

export default function FilmHeader({
  film,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  film: FilmSimulation
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  return (
    <PhotoHeader
      film={film}
      entity={<PhotoFilm {...{ film }} />}
      entityDescription={descriptionForFilmPhotos(
        photos, undefined, count, dateRange)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      includeShareButton
    />
  );
}
