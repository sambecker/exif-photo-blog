import { Cameras } from '@/camera';
import PhotoCamera from '@/camera/PhotoCamera';
import HeaderList from '@/components/HeaderList';
import PhotoTag from '@/tag/PhotoTag';
import { FaTag } from 'react-icons/fa';
import { IoMdCamera } from 'react-icons/io';
import { photoQuantityText } from '.';
import { Tags } from '@/tag';
import PhotoFujifilmSimulation from 
  '@/vendors/fujifilm/PhotoFujifilmSimulation';
import { FujifilmSimulations } from '@/vendors/fujifilm';
import PhotoFujifilmSimulationIcon from
  '@/vendors/fujifilm/PhotoFujifilmSimulationIcon';

export default function PhotoGridSidebar({
  tags,
  cameras,
  simulations,
  photosCount,
}: {
  tags: Tags
  cameras: Cameras
  simulations: FujifilmSimulations
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
        items={cameras.map(({ cameraKey, camera, count }) =>
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
        icon={<PhotoFujifilmSimulationIcon
          className="translate-y-[-0.5px]"
        />}
        className="space-y-0.5"
        items={simulations.map(({ simulation }) =>
          <div
            key={simulation}
            className="translate-x-[-2px]"
          >
            <PhotoFujifilmSimulation
              simulation={simulation}
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
