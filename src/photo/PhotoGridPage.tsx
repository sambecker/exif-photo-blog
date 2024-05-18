import SiteGrid from '@/components/SiteGrid';
import { Photo } from '.';
import PhotoGrid from './PhotoGrid';
import PhotoGridInfinite from './PhotoGridInfinite';
import { Camera } from '@/camera';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';

export default function PhotoGridPage({
  photos,
  count,
  camera,
  animateOnFirstLoadOnly,
  header,
  sidebar,
}: {
  photos: Photo[]
  count: number
  camera?: Camera
  animateOnFirstLoadOnly?: boolean
  header?: JSX.Element
  sidebar?: JSX.Element
}) {
  return (
    <SiteGrid
      contentMain={<div className={clsx(
        header && 'space-y-8 mt-4',
      )}>
        {header &&
          <AnimateItems
            type="bottom"
            items={[header]}
            animateOnFirstLoadOnly
          />}
        <div className="space-y-0.5 sm:space-y-1">
          <PhotoGrid {...{ photos, camera, animateOnFirstLoadOnly }} />
          {count > photos.length &&
            <PhotoGridInfinite {...{
              initialOffset: photos.length,
              camera,
              animateOnFirstLoadOnly,
            }} />}
        </div>
      </div>}
      contentSide={sidebar}
      sideHiddenOnMobile
    />
  );
}
