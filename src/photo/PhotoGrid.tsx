import { Photo } from '.';
import PhotoSmall from './PhotoSmall';
import { cc } from '@/utility/css';
import AnimateItems from '@/components/AnimateItems';
import { Camera } from '@/camera';
import MorePhotos from '@/photo/MorePhotos';
import { FilmSimulation } from '@/simulation';
import { GRID_ASPECT_RATIO, HIGH_DENSITY_GRID } from '@/site/config';

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
          'grid gap-0.5 sm:gap-1',
          small
            ? 'grid-cols-3 xs:grid-cols-6'
            : HIGH_DENSITY_GRID
              ? 'grid-cols-2 xs:grid-cols-4 lg:grid-cols-5'
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
          <div
            key={photo.id}
            className={GRID_ASPECT_RATIO !== 0
              ? cc(
                'aspect-square',
                'overflow-hidden',
                '[&>*]:flex [&>*]:w-full [&>*]:h-full',
                '[&>*>*]:object-cover [&>*>*]:min-h-full',
              )
              : undefined}
            style={{
              ...GRID_ASPECT_RATIO !== 0 && {
                aspectRatio: GRID_ASPECT_RATIO,
              },
            }}
          >
            <PhotoSmall {...{
              photo,
              tag,
              camera,
              simulation,
              selected: photo.id === selectedPhoto?.id,
            }} />
          </div>).concat(additionalTile ?? [])}
      />
      {showMorePath &&
        <MorePhotos path={showMorePath} />}
    </div>
  );
};
