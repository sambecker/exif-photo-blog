import { Cameras, sortCamerasWithCount } from '@/camera';
import PhotoCamera from '@/camera/PhotoCamera';
import HeaderList from '@/components/HeaderList';
import PhotoTag from '@/tag/PhotoTag';
import { FaTag } from 'react-icons/fa';
import { IoMdCamera } from 'react-icons/io';
import { PhotoDateRange, dateRangeForPhotos, photoQuantityText } from '.';
import { TAG_FAVS, TagsWithMeta } from '@/tag';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import PhotoFilmSimulationIcon from '@/simulation/PhotoFilmSimulationIcon';
import { FilmSimulations, sortFilmSimulationsWithCount } from '@/simulation';
import FavsTag from '../tag/FavsTag';

export default function PhotoGridSidebar({
  tags,
  cameras,
  simulations,
  photosCount,
  photosDateRange,
}: {
  tags: TagsWithMeta
  cameras: Cameras
  simulations: FilmSimulations
  photosCount: number
  photosDateRange?: PhotoDateRange
}) {
  const { start, end } = dateRangeForPhotos(undefined, photosDateRange);

  return (
    <>
      {tags.length > 0 && <HeaderList
        title='Tags'
        icon={<FaTag size={12} className="text-icon" />}
        items={tags.map(({ tag, count }) => tag === TAG_FAVS
          ? <FavsTag
            key={TAG_FAVS}
            countOnHover={count}
            type="icon-last"
            prefetch={false}
            contrast="low"
            badged
          />
          : <PhotoTag
            key={tag}
            tag={tag}
            type="text-only"
            countOnHover={count}
            prefetch={false}
            contrast="low"
            badged
          />)}
      />}
      {cameras.length > 0 && <HeaderList
        title="Cameras"
        icon={<IoMdCamera
          size={13}
          className="text-icon translate-y-[-0.25px]"
        />}
        items={cameras
          .sort(sortCamerasWithCount)
          .map(({ cameraKey, camera, count }) =>
            <PhotoCamera
              key={cameraKey}
              camera={camera}
              type="text-only"
              countOnHover={count}
              prefetch={false}
              contrast="low"
              hideAppleIcon
              badged
            />)}
      />}
      {simulations.length > 0 && <HeaderList
        title="Films"
        icon={<PhotoFilmSimulationIcon
          className="translate-y-[0.5px]"
        />}
        items={simulations
          .sort(sortFilmSimulationsWithCount)
          .map(({ simulation, count }) =>
            <div
              key={simulation}
              className="translate-x-[-2px]"
            >
              <PhotoFilmSimulation
                simulation={simulation}
                countOnHover={count}
                type="text-only"
                prefetch={false}
              />
            </div>)}
      />}
      {photosCount > 0 && start
        ? <HeaderList
          title={photoQuantityText(photosCount, false)}
          items={start === end
            ? [start]
            : [`${end} –`, start]}
        />
        : <HeaderList
          items={[photoQuantityText(photosCount, false)]}
        />}
    </>
  );
}
