import PhotoTag from '@/tag/PhotoTag';
import { isTagFavs } from '.';
import FavsTag from './FavsTag';
import { EntityLinkExternalProps } from '@/components/EntityLink';

export default function PhotoTags({
  tags,
  contrast,
}: {
  tags: string[]
} & EntityLinkExternalProps) {
  return (
    <div className="-space-y-0.5">
      {tags.map(tag =>
        <div key={tag}>
          {isTagFavs(tag)
            ? <FavsTag {...{ contrast }} />
            : <PhotoTag {...{ tag, contrast }} />}
        </div>)}
    </div>
  );
}
