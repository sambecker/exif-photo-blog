import CommandKClient, { CommandKSection } from '@/components/CommandKClient';
import {
  getPhotosCountCached,
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
  pathForPhoto,
  pathForTag,
} from './paths';
import { formatCameraText } from '@/camera';
import { authCached } from '@/auth/cache';
import { getPhotos } from '@/services/vercel-postgres';
import { photoQuantityText, titleForPhoto } from '@/photo';
import PhotoTiny from '@/photo/PhotoTiny';
import { formatDate } from '@/utility/date';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import { BiLockAlt } from 'react-icons/bi';
import { sortTagsObject } from '@/tag';
import PhotoFilmSimulationIcon from '@/simulation/PhotoFilmSimulationIcon';
import { FaTag } from 'react-icons/fa';
import { TbPhoto } from 'react-icons/tb';
import { IoMdCamera } from 'react-icons/io';
import { HiDocumentText } from 'react-icons/hi';

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

  const session = await authCached().catch(() => null);

  const showAdminPages = Boolean(session?.user?.email);

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
      <PhotoFilmSimulationIcon />
    </span>,
    items: filmSimulations.map(({ simulation, count }) => ({
      label: simulation,
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
      path: pathForFilmSimulation(simulation),
    })),
  };

  const SECTION_PAGES: CommandKSection = {
    heading: 'Pages',
    accessory: <HiDocumentText size={15} className="translate-x-[-1px]" />,
    items: ([{
      label: 'Home',
      path: '/',
    }, {
      label: 'Grid',
      path:'/grid',
    }] as CommandKSection['items']).concat(showAdminPages ? [{
      label: 'Admin / Photos',
      annotation: <BiLockAlt />,
      path: PATH_ADMIN_PHOTOS,
    }, {
      label: 'Admin / Uploads',
      annotation: <BiLockAlt />,
      path: PATH_ADMIN_UPLOADS,
    }, {
      label: 'Admin / Tags',
      annotation: <BiLockAlt />,
      path: PATH_ADMIN_TAGS,
    }, {
      label: 'Admin / Config',
      annotation: <BiLockAlt />,
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
    onQueryChange={async (query) => {
      'use server';
      const photos = (await getPhotos({ title: query, limit: 10 }))
        .filter(({ title }) => Boolean(title));
      return photos.length > 0
        ? [{
          heading: 'Photos',
          accessory: <TbPhoto size={14} />,
          items: photos.map(photo => ({
            accessory: <PhotoTiny photo={photo} />,
            label: titleForPhoto(photo),
            annotation: formatDate(photo.takenAt),
            path: pathForPhoto(photo),
          })),
        }]
        : [];
    }}
    footer={photoQuantityText(count, false)}
  />;
}
