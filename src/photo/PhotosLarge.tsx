import AnimateItems from '@/components/AnimateItems';
import { Photo } from '.';
import PhotoLarge from './PhotoLarge';
import { RevalidatePhoto } from './InfinitePhotoScroll';
import { PhotoSetCategory } from '../category';

export default function PhotosLarge({
  photos,
  animate = true,
  prefetchFirstPhotoLinks,
  onLastPhotoVisible,
  revalidatePhoto,
  showStorageCheck,
  query,
  recent,
  year,
  camera,
  lens,
  album,
  tag,
  recipe,
  film,
  focal,
}: {
  photos: Photo[]
  animate?: boolean
  prefetchFirstPhotoLinks?: boolean
  onLastPhotoVisible?: () => void
  revalidatePhoto?: RevalidatePhoto
  showStorageCheck?: boolean
} & PhotoSetCategory) {
  return (
    <AnimateItems
      className="space-y-1"
      type={animate ? 'scale' : 'none'}
      duration={0.7}
      staggerDelay={0.15}
      distanceOffset={0}
      staggerOnFirstLoadOnly
      items={photos.map((photo, index) =>
        <PhotoLarge
          key={photo.id}
          photo={photo}
          priority={index <= 1}
          prefetchRelatedLinks={prefetchFirstPhotoLinks && index === 0}
          revalidatePhoto={revalidatePhoto}
          shouldZoomOnFKeydown={false}
          album={album}
          primaryTag={tag}
          query={query}
          recent={recent}
          year={year}
          // Avoid repeating the category the set is already filtered by
          showCamera={!camera}
          showLens={!lens}
          showFilm={!film}
          showRecipe={!recipe}
          shouldShareQuery={query !== undefined}
          shouldShareRecents={recent !== undefined}
          shouldShareYear={year !== undefined}
          shouldShareCamera={camera !== undefined}
          shouldShareLens={lens !== undefined}
          shouldShareAlbum={album !== undefined}
          shouldShareTag={tag !== undefined}
          shouldShareFilm={film !== undefined}
          shouldShareRecipe={recipe !== undefined}
          shouldShareFocalLength={focal !== undefined}
          onVisible={index === photos.length - 1
            ? onLastPhotoVisible
            : undefined}
          showStorageCheck={showStorageCheck}
        />)}
      itemKeys={photos.map(photo => photo.id)}
    />
  );
}
