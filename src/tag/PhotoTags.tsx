import PhotoTag from '@/tag/PhotoTag';
import { isTagFavs } from '.';
import FavsTag from './FavsTag';

export default function PhotoTags({
  tags,
  prefetch,
}: {
  tags: string[]
  prefetch?: boolean
}) {
  return (
    <div className="-space-y-0.5">
      {tags.map(tag =>
        <div key={tag}>
          {isTagFavs(tag)
            ? <FavsTag {...{ prefetch }} />
            : <PhotoTag {...{ tag, prefetch }} />}
        </div>)}
    </div>
  );
}
