import PhotoTag from '@/tag/PhotoTag';
import { isTagFavs } from '.';
import PhotoFavs from './PhotoFavs';
import { EntityLinkExternalProps } from '@/components/entity/EntityLink';
import { Fragment } from 'react';
import clsx from 'clsx/lite';

export default function PhotoTags({
  tags,
  tagCounts = {},
  contrast,
  prefetch,
  className,
}: {
  tags: string[]
  tagCounts?: Record<string, number>
  className?: string
} & EntityLinkExternalProps) {
  return (
    <div className={clsx('flex flex-col', className)}>
      {tags.map(tag =>
        <Fragment key={tag}>
          {isTagFavs(tag)
            ? <PhotoFavs {...{
              contrast,
              prefetch,
              hoverCount: tagCounts[tag],
            }} />
            : <PhotoTag {...{
              tag,
              contrast,
              prefetch, hoverCount: tagCounts[tag] }} />}
        </Fragment>)}
    </div>
  );
}
