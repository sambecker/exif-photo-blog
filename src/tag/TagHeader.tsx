import { Photo } from '@/photo';
import PhotoTag from './PhotoTag';
import { descriptionForTaggedPhotos } from '.';
import { pathForTagShare } from '@/site/paths';
import PhotoHeader from '@/photo/PhotoHeader';
import AnimateItems from '@/components/AnimateItems';

export default function TagHeader({
  tag,
  photos,
  selectedPhoto,
  count,
}: {
  tag: string
  photos: Photo[]
  selectedPhoto?: Photo
  count?: number
}) {
  return (
    <AnimateItems
      type="bottom"
      distanceOffset={10}
      items={[<PhotoHeader
        key="PhotoHeader"
        entity={<PhotoTag tag={tag} />}
        entityVerb="Tagged"
        entityDescription={descriptionForTaggedPhotos(photos, undefined, count)}
        photos={photos}
        selectedPhoto={selectedPhoto}
        sharePath={pathForTagShare(tag)}
        count={count}
      />]}
    />
  );
}
