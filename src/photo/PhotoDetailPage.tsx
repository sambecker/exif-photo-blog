import AnimateItems from '@/components/AnimateItems';
import { Photo } from '.';
import PhotoLarge from './PhotoLarge';
import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from './PhotoGrid';
import { cc } from '@/utility/css';
import PhotoLinks from './PhotoLinks';
import TagHeader from '@/tag/TagHeader';

export default function PhotoDetailPage({
  photo,
  photos,
  photosGrid,
  tag,
}: {
  photo: Photo
  photos: Photo[]
  photosGrid?: Photo[]
  tag?: string
}) {
  return (
    <div>
      {tag &&
        <SiteGrid
          className="mt-4 mb-8"
          contentMain={
            <TagHeader
              key={tag}
              tag={tag}
              photos={photos}
              selectedPhoto={photo}
            />}
        />}
      <AnimateItems
        className="md:mb-8"
        animateFromAppState
        items={[
          <PhotoLarge
            key={photo.id}
            photo={photo}
            tag={tag}
            priority
            prefetchShare
            shouldScrollOnShare={false}
          />,
        ]}
      />
      <SiteGrid
        sideFirstOnMobile
        contentMain={<PhotoGrid
          photos={photosGrid ?? photos}
          selectedPhoto={photo}
          tag={tag}
          animateOnFirstLoadOnly
        />}
        contentSide={<div className={cc(
          'grid grid-cols-2',
          'md:flex md:gap-4',
          'user-select-none',
        )}>
          <PhotoLinks photo={photo} photos={photos} tag={tag} />
        </div>}
      />
    </div>
  );
}
