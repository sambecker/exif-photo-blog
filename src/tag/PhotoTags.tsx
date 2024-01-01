import PhotoTag from '@/tag/PhotoTag';
import { isTagFavs } from '.';
import FavsTag from './FavsTag';

export default function PhotoTags({
  tags,
}: {
  tags: string[]
}) {
  return (
    <div className="-space-y-0.5">
      {tags.map(tag =>
        <div key={tag}>
          {isTagFavs(tag)
            ? <FavsTag />
            : <PhotoTag tag={tag} />}
        </div>)}
    </div>
  );
}
