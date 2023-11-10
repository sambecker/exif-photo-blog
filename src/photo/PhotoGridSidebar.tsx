import { Cameras, sortCamerasWithCount } from '@/camera';
import PhotoCamera from '@/camera/PhotoCamera';
import HeaderList from '@/components/HeaderList';
import PhotoTag from '@/tag/PhotoTag';
import { FaTag } from 'react-icons/fa';
import { IoMdCamera } from 'react-icons/io';
import { photoQuantityText } from '.';
import { Tags } from '@/tag';
import PhotoFilmSimulation from 
  '@/simulation/PhotoFilmSimulation';
import PhotoFilmSimulationIcon from
  '@/simulation/PhotoFilmSimulationIcon';
import { FilmSimulations, sortFilmSimulationsWithCount } from '@/simulation';

export default function PhotoGridSidebar({
  tags,
  cameras,
  simulations,
  photosCount,
}: {
  tags: Tags
  cameras: Cameras
  simulations: FilmSimulations
  photosCount: number
}) {
  return (
    <>
      {tags.length > 0 && <HeaderList
        title='Tags'
        icon={<FaTag size={12} className="text-icon" />}
        items={tags.map(({ tag, count }) =>
          <PhotoTag
            key={tag}
            tag={tag}
            showIcon={false}
            countOnHover={count}
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
              showIcon={false}
              countOnHover={count}
              hideApple
            />)}
      />}
      {simulations.length > 0 && <HeaderList
        title="Films"
        icon={<PhotoFilmSimulationIcon
          className="translate-y-[-0.5px]"
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
              />
            </div>)}
      />}
      {photosCount > 0 && <HeaderList
        items={[photoQuantityText(photosCount, false)]}
      />}
    </>
  );
}
