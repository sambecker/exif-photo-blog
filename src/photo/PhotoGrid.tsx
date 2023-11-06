import { Photo } from '.';
import PhotoSmall from './PhotoSmall';
import { cc } from '@/utility/css';
import AnimateItems from '@/components/AnimateItems';
import { Camera } from '@/camera';
import MorePhotos from '@/photo/MorePhotos';
import { FilmSimulation } from '@/simulation';

export default function PhotoGrid({
  photos,
  selectedPhoto,
  tag,
  camera,
  simulation,
  fast,
  animate = true,
  animateOnFirstLoadOnly,
  staggerOnFirstLoadOnly = true,
  showMorePath,
  additionalTile,
  small,
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  fast?: boolean
  animate?: boolean
  animateOnFirstLoadOnly?: boolean
  staggerOnFirstLoadOnly?: boolean
  showMorePath?: string
  additionalTile?: JSX.Element
  small?: boolean
}) {
  return (
    <div className="space-y-4">
      <AnimateItems
        className={cc(
          'grid gap-1',
          small
            ? 'grid-cols-3 xs:grid-cols-6'
            : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4',
          'items-center',
        )}
        type={animate === false ? 'none' : undefined}
        duration={fast ? 0.3 : undefined}
        staggerDelay={0.075}
        distanceOffset={40}
        animateOnFirstLoadOnly={animateOnFirstLoadOnly}
        staggerOnFirstLoadOnly={staggerOnFirstLoadOnly}
        items={photos.map(photo =>
          <PhotoSmall
            key={photo.id}
            photo={photo}
            tag={tag}
            camera={camera}
            simulation={simulation}
            selected={photo.id === selectedPhoto?.id}
          />).concat(additionalTile ?? [])}
      />
      {showMorePath &&
        <MorePhotos path={showMorePath} />}
    </div>
  );
};
