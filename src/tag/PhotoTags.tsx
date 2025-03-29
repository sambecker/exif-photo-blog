import PhotoTag from '@/tag/PhotoTag';
import { isTagFavs } from '.';
import FavsTag from './FavsTag';
import { EntityLinkExternalProps } from '@/components/primitives/EntityLink';
import { Fragment } from 'react';

export default function PhotoTags({
  tags,
  tagCounts = {},
  contrast,
  prefetch,
}: {
  tags: string[]
  tagCounts?: Record<string, number>
} & EntityLinkExternalProps) {
  return (
    <div className="flex flex-col">
      {tags.map(tag =>
        <Fragment key={tag}>
          {isTagFavs(tag)
            ? <FavsTag {...{
              contrast,
              prefetch,
              countOnHover: tagCounts[tag],
            }} />
            : <PhotoTag {...{
              tag,
              contrast,
              prefetch, countOnHover: tagCounts[tag] }} />}
        </Fragment>)}
    </div>
  );
}
