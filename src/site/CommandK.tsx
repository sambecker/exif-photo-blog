import CommandKClient, { CommandKSection } from '@/components/CommandKClient';
import {
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  pathForCamera,
  pathForFilmSimulation,
  pathForTag,
} from './paths';
import { formatCameraText } from '@/camera';
import { photoQuantityText } from '@/photo';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import { sortTagsObject } from '@/tag';
import PhotoFilmSimulationIcon from '@/simulation/PhotoFilmSimulationIcon';
import { FaTag } from 'react-icons/fa';
import { IoMdCamera } from 'react-icons/io';
import { ADMIN_DEBUG_TOOLS_ENABLED } from './config';

export default async function CommandK() {
  const [
    count,
    tags,
    cameras,
    filmSimulations,
  ] = await Promise.all([
    getPhotosCountCached().catch(() => 0),
    getUniqueTagsCached().catch(() => []),
    getUniqueCamerasCached().catch(() => []),
    getUniqueFilmSimulationsCached().catch(() => []),
  ]);

  const SECTION_TAGS: CommandKSection = {
    heading: 'Tags',
    accessory: <FaTag
      size={10}
      className="translate-x-[1px] translate-y-[0.75px]"
    />,
    items: sortTagsObject(tags).map(({ tag, count }) => ({
      label: tag,
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
      path: pathForTag(tag),
    })),
  };

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
    serverSections={[
      SECTION_TAGS,
      SECTION_CAMERAS,
      SECTION_FILM,
    ]}
    showDebugTools={ADMIN_DEBUG_TOOLS_ENABLED}
    footer={photoQuantityText(count, false)}
  />;
}
