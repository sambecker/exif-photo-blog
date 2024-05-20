import CommandKClient, { CommandKSection } from '@/components/CommandKClient';
import {
  getPhotosMetaCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  pathForCamera,
  pathForFilmSimulation,
} from './paths';
import { formatCameraText } from '@/camera';
import { photoQuantityText } from '@/photo';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import { TagsWithMeta } from '@/tag';
import PhotoFilmSimulationIcon from '@/simulation/PhotoFilmSimulationIcon';
import { IoMdCamera } from 'react-icons/io';
import { ADMIN_DEBUG_TOOLS_ENABLED, SHOW_FILM_SIMULATIONS } from './config';

export default async function CommandK() {
  const [
    count,
    tags,
    cameras,
    filmSimulations,
  ] = await Promise.all([
    getPhotosMetaCached()
      .then(({ count }) => count)
      .catch(() => 0),
    getUniqueTagsCached().catch(() => [] as TagsWithMeta),
    getUniqueCamerasCached().catch(() => []),
    SHOW_FILM_SIMULATIONS
      ? getUniqueFilmSimulationsCached().catch(() => [])
      : [],
  ]);

  const SECTION_CAMERAS: CommandKSection = {
    heading: 'Cameras',
    accessory: <IoMdCamera />,
    items: cameras.map(({ camera, count }) => ({
      label: formatCameraText(camera),
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
      path: pathForCamera(camera),
    })),
  };

  const SECTION_FILM: CommandKSection = {
    heading: 'Film Simulations',
    accessory: <span className="w-3">
      <PhotoFilmSimulationIcon className="translate-y-[0.5px]" />
    </span>,
    items: filmSimulations.map(({ simulation, count }) => ({
      label: simulation,
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
      path: pathForFilmSimulation(simulation),
    })),
  };

  return <CommandKClient
    tags={tags}
    serverSections={[
      SECTION_CAMERAS,
      SECTION_FILM,
    ]}
    showDebugTools={ADMIN_DEBUG_TOOLS_ENABLED}
    footer={photoQuantityText(count, false)}
  />;
}
