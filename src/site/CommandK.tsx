import CommandKClient from '@/components/CommandKClient';
import {
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import { pathForCamera, pathForFilmSimulation, pathForTag } from './paths';
import { formatCameraText } from '@/camera';

export default async function CommandK() {
  const [
    tags,
    cameras,
    filmSimulations,
  ] = await Promise.all([
    getUniqueTagsCached().catch(() => []),
    getUniqueCamerasCached().catch(() => []),
    getUniqueFilmSimulationsCached().catch(() => []),
  ]);

  return <CommandKClient
    sections={[
      {
        heading: 'Pages',
        items: [{
          label: 'Home',
          path: '/',
        }, {
          label: 'Grid',
          path:'/grid',
        }],
      }, {
        heading: 'Tags',
        items: tags.map(({ tag }) => ({
          label: tag,
          path: pathForTag(tag),
        })),
      }, {
        heading: 'Cameras',
        items: cameras.map(({ camera }) => ({
          label: formatCameraText(camera),
          path: pathForCamera(camera),
        })),
      }, {
        heading: 'Film Simulations',
        items: filmSimulations.map(({ simulation }) => ({
          label: simulation,
          path: pathForFilmSimulation(simulation),
        })),
      },
    ]}
  />;
}
