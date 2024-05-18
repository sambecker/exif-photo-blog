import SiteGrid from '@/components/SiteGrid';
import { Photo } from '.';
import PhotoGrid from './PhotoGrid';
import PhotoGridInfinite from './PhotoGridInfinite';
import { Camera } from '@/camera';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import { FilmSimulation } from '@/simulation';

export default function PhotoGridPage({
  cacheKey,
  photos,
  count,
  tag,
  camera,
  simulation,
  animateOnFirstLoadOnly,
  header,
  sidebar,
}: {
  cacheKey: string
  photos: Photo[]
  count: number
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
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
          <PhotoGrid {...{
            photos,
            tag,
            camera,
            simulation,
            animateOnFirstLoadOnly,
          }} />
          {count > photos.length &&
            <PhotoGridInfinite {...{
              cacheKey,
              initialOffset: photos.length,
              tag,
              camera,
              simulation,
              animateOnFirstLoadOnly,
            }} />}
        </div>
      </div>}
      contentSide={sidebar}
      sideHiddenOnMobile
    />
  );
}
