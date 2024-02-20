import CommandKClient, { CommandKSection } from '@/components/CommandKClient';
import {
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
  pathForCamera,
  pathForFilmSimulation,
  pathForTag,
} from './paths';
import { formatCameraText } from '@/camera';
import { authCached } from '@/auth/cache';

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

  const session = await authCached().catch(() => null);

  const showAdminPages = Boolean(session?.user?.email);

  const SECTION_TAGS: CommandKSection = {
    heading: 'Tags',
    items: tags.map(({ tag }) => ({
      label: tag,
      path: pathForTag(tag),
    })),
  };

  const SECTION_CAMERAS: CommandKSection = {
    heading: 'Cameras',
    items: cameras.map(({ camera }) => ({
      label: formatCameraText(camera),
      path: pathForCamera(camera),
    })),
  };

  const SECTION_FILM: CommandKSection = {
    heading: 'Film Simulations',
    items: filmSimulations.map(({ simulation }) => ({
      label: simulation,
      path: pathForFilmSimulation(simulation),
    })),
  };

  const SECTION_PAGES: CommandKSection = {
    heading: 'Pages',
    items: [{
      label: 'Home',
      path: '/',
    }, {
      label: 'Grid',
      path:'/grid',
    }].concat(showAdminPages ? [{
      label: 'Admin » Photos',
      path: PATH_ADMIN_PHOTOS,
    }, {
      label: 'Admin » Uploads',
      path: PATH_ADMIN_UPLOADS,
    }, {
      label: 'Admin » Tags',
      path: PATH_ADMIN_TAGS,
    }, {
      label: 'Admin » Config',
      path: PATH_ADMIN_CONFIGURATION,
    }] : []),
  };

  return <CommandKClient
    sections={[
      SECTION_TAGS,
      SECTION_CAMERAS,
      SECTION_FILM,
      SECTION_PAGES,
    ]}
  />;
}
