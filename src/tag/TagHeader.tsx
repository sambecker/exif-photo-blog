import { Photo } from '@/photo';
import PhotoTag from './PhotoTag';
import { descriptionForTaggedPhotos } from '.';
import { pathForTagShare } from '@/site/paths';
import PhotoSetHeader from '@/photo/PhotoSetHeader';

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
    <PhotoSetHeader
      entity={<PhotoTag tag={tag} />}
      entityVerb="Tagged"
      entityDescription={descriptionForTaggedPhotos(photos, undefined, count)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      sharePath={pathForTagShare(tag)}
      count={count}
    />
  );
}
