import { Photo } from '@/photo';
import { BASE_URL } from './config';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';
import { parameterize } from '@/utility/string';
import { TAG_HIDDEN } from '@/tag';

// Core paths
export const PATH_ROOT    = '/';
export const PATH_GRID    = '/grid';
export const PATH_ADMIN   = '/admin';
export const PATH_API     = '/api';
export const PATH_SIGN_IN = '/sign-in';
export const PATH_OG      = '/og';

// Path prefixes
export const PREFIX_PHOTO           = '/p';
export const PREFIX_TAG             = '/tag';
export const PREFIX_CAMERA          = '/shot-on';
export const PREFIX_FILM_SIMULATION = '/film';
export const PREFIX_FOCAL_LENGTH    = '/focal';

// Dynamic paths
const PATH_PHOTO_DYNAMIC            = `${PREFIX_PHOTO}/[photoId]`;
const PATH_TAG_DYNAMIC              = `${PREFIX_TAG}/[tag]`;
const PATH_CAMERA_DYNAMIC           = `${PREFIX_CAMERA}/[make]/[model]`;
const PATH_FILM_SIMULATION_DYNAMIC  = `${PREFIX_FILM_SIMULATION}/[simulation]`;
const PATH_FOCAL_LENGTH_DYNAMIC     = `${PREFIX_FOCAL_LENGTH}/[focal]`;

// Admin paths
export const PATH_ADMIN_PHOTOS        = `${PATH_ADMIN}/photos`;
export const PATH_ADMIN_UPLOADS       = `${PATH_ADMIN}/uploads`;
export const PATH_ADMIN_TAGS          = `${PATH_ADMIN}/tags`;
export const PATH_ADMIN_CONFIGURATION = `${PATH_ADMIN}/configuration`;
export const PATH_ADMIN_BASELINE      = `${PATH_ADMIN}/baseline`;

// API paths
export const PATH_API_STORAGE = `${PATH_API}/storage`;
export const PATH_API_VERCEL_BLOB_UPLOAD = `${PATH_API_STORAGE}/vercel-blob`;
export const PATH_API_PRESIGNED_URL = `${PATH_API_STORAGE}/presigned-url`;

// Modifiers
const SHARE = 'share';
const EDIT  = 'edit';

export const PATHS_ADMIN = [
  PATH_ADMIN,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_UPLOADS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_CONFIGURATION,
];

export const PATHS_TO_CACHE = [
  PATH_ROOT,
  PATH_GRID,
  PATH_OG,
  PATH_PHOTO_DYNAMIC,
  PATH_TAG_DYNAMIC,
  PATH_CAMERA_DYNAMIC,
  PATH_FILM_SIMULATION_DYNAMIC,
  PATH_FOCAL_LENGTH_DYNAMIC,
  ...PATHS_ADMIN,
];

interface PhotoPathParams {
  photo: PhotoOrPhotoId
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  focal?: number
}

// Absolute paths
export const ABSOLUTE_PATH_FOR_HOME_IMAGE = `${BASE_URL}/home-image`;

export const pathForAdminUploadUrl = (url: string) =>
  `${PATH_ADMIN_UPLOADS}/${encodeURIComponent(url)}`;

export const pathForAdminPhotoEdit = (photo: PhotoOrPhotoId) =>
  `${PATH_ADMIN_PHOTOS}/${getPhotoId(photo)}/${EDIT}`;

export const pathForAdminTagEdit = (tag: string) =>
  `${PATH_ADMIN_TAGS}/${tag}/${EDIT}`;

type PhotoOrPhotoId = Photo | string;

const getPhotoId = (photoOrPhotoId: PhotoOrPhotoId) =>
  typeof photoOrPhotoId === 'string' ? photoOrPhotoId : photoOrPhotoId.id;

export const pathForPhoto = ({
  photo,
  tag,
  camera,
  simulation,
  focal,
}: PhotoPathParams) =>
  typeof photo !== 'string' && photo.hidden
    ? `${pathForTag(TAG_HIDDEN)}/${getPhotoId(photo)}`
    : tag
      ? `${pathForTag(tag)}/${getPhotoId(photo)}`
      : camera
        ? `${pathForCamera(camera)}/${getPhotoId(photo)}`
        : simulation
          ? `${pathForFilmSimulation(simulation)}/${getPhotoId(photo)}`
          : focal
            ? `${pathForFocalLength(focal)}/${getPhotoId(photo)}`
            : `${PREFIX_PHOTO}/${getPhotoId(photo)}`;

export const pathForPhotoShare = (params: PhotoPathParams) =>
  `${pathForPhoto(params)}/${SHARE}`;

export const pathForTag = (tag: string) =>
  `${PREFIX_TAG}/${tag}`;

export const pathForTagShare = (tag: string) =>
  `${pathForTag(tag)}/${SHARE}`;

export const pathForCamera = ({ make, model }: Camera) =>
  `${PREFIX_CAMERA}/${parameterize(make, true)}/${parameterize(model, true)}`;

export const pathForCameraShare = (camera: Camera) =>
  `${pathForCamera(camera)}/${SHARE}`;

export const pathForFilmSimulation = (simulation: FilmSimulation) =>
  `${PREFIX_FILM_SIMULATION}/${simulation}`;

export const pathForFilmSimulationShare = (simulation: FilmSimulation) =>
  `${pathForFilmSimulation(simulation)}/${SHARE}`;

export const pathForFocalLength = (focal: number) =>
  `${PREFIX_FOCAL_LENGTH}/${focal}mm`;

export const pathForFocalLengthShare = (focal: number) =>
  `${pathForFocalLength(focal)}/${SHARE}`;;

export const absolutePathForPhoto = (params: PhotoPathParams) =>
  `${BASE_URL}${pathForPhoto(params)}`;

export const absolutePathForTag = (tag: string) =>
  `${BASE_URL}${pathForTag(tag)}`;

export const absolutePathForCamera= (camera: Camera) =>
  `${BASE_URL}${pathForCamera(camera)}`;

export const absolutePathForFilmSimulation = (simulation: FilmSimulation) =>
  `${BASE_URL}${pathForFilmSimulation(simulation)}`;

export const absolutePathForFocalLength = (focal: number) =>
  `${BASE_URL}${pathForFocalLength(focal)}`;

export const absolutePathForPhotoImage = (photo: PhotoOrPhotoId) =>
  `${absolutePathForPhoto({ photo })}/image`;

export const absolutePathForTagImage = (tag: string) =>
  `${absolutePathForTag(tag)}/image`;

export const absolutePathForCameraImage= (camera: Camera) =>
  `${absolutePathForCamera(camera)}/image`;

export const absolutePathForFilmSimulationImage =
  (simulation: FilmSimulation) =>
    `${absolutePathForFilmSimulation(simulation)}/image`;

export const absolutePathForFocalLengthImage =
  (focal: number) =>
    `${absolutePathForFocalLength(focal)}/image`;

// p/[photoId]
export const isPathPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_PHOTO}/[^/]+/?$`).test(pathname);

// p/[photoId]/share
export const isPathPhotoShare = (pathname = '') =>
  new RegExp(`^${PREFIX_PHOTO}/[^/]+/${SHARE}/?$`).test(pathname);

// tag/[tag]
export const isPathTag = (pathname = '') =>
  new RegExp(`^${PREFIX_TAG}/[^/]+/?$`).test(pathname);

// tag/[tag]/share
export const isPathTagShare = (pathname = '') =>
  new RegExp(`^${PREFIX_TAG}/[^/]+/${SHARE}/?$`).test(pathname);

// tag/[tag]/[photoId]
export const isPathTagPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_TAG}/[^/]+/[^/]+/?$`).test(pathname);

// tag/[tag]/[photoId]/share
export const isPathTagPhotoShare = (pathname = '') =>
  new RegExp(`^${PREFIX_TAG}/[^/]+/[^/]+/${SHARE}/?$`).test(pathname);

// shot-on/[make]/[model]
export const isPathCamera = (pathname = '') =>
  new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/?$`).test(pathname);

// shot-on/[make]/[model]/share
export const isPathCameraShare = (pathname = '') =>
  new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/${SHARE}/?$`).test(pathname);

// shot-on/[make]/[model]/[photoId]
export const isPathCameraPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/[^/]+/?$`).test(pathname);

// shot-on/[make]/[model]/[photoId]/share
export const isPathCameraPhotoShare = (pathname = '') =>
  new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/[^/]+/${SHARE}/?$`).test(pathname);

// film/[simulation]
export const isPathFilmSimulation = (pathname = '') =>
  new RegExp(`^${PREFIX_FILM_SIMULATION}/[^/]+/?$`).test(pathname);

// film/[simulation]/share
export const isPathFilmSimulationShare = (pathname = '') =>
  new RegExp(`^${PREFIX_FILM_SIMULATION}/[^/]+/${SHARE}/?$`).test(pathname);

// film/[simulation]/[photoId]
export const isPathFilmSimulationPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_FILM_SIMULATION}/[^/]+/[^/]+/?$`).test(pathname);

// film/[simulation]/[photoId]/share
export const isPathFilmSimulationPhotoShare = (pathname = '') =>
  new RegExp(`^${PREFIX_FILM_SIMULATION}/[^/]+/[^/]+/${SHARE}/?$`)
    .test(pathname);

// focal/[focal]
export const isPathFocalLength = (pathname = '') =>
  new RegExp(`^${PREFIX_FOCAL_LENGTH}/[^/]+/?$`).test(pathname);

// focal/[focal]/share
export const isPathFocalLengthShare = (pathname = '') =>
  new RegExp(`^${PREFIX_FOCAL_LENGTH}/[^/]+/${SHARE}/?$`).test(pathname);

// focal/[focal]/[photoId]
export const isPathFocalLengthPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_FOCAL_LENGTH}/[^/]+/[^/]+/?$`).test(pathname);

// focal/[focal]/[photoId]/share
export const isPathFocalLengthPhotoShare = (pathname = '') =>
  new RegExp(`^${PREFIX_FOCAL_LENGTH}/[^/]+/[^/]+/${SHARE}/?$`)
    .test(pathname);

export const checkPathPrefix = (pathname = '', prefix: string) =>
  pathname.toLowerCase().startsWith(prefix);

export const isPathGrid = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_GRID);

export const isPathSignIn = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_SIGN_IN);

export const isPathAdmin = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_ADMIN);

export const isPathTopLevelAdmin = (pathname?: string) =>
  PATHS_ADMIN.some(path => path === pathname);

export const isPathAdminConfiguration = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_ADMIN_CONFIGURATION);

export const isPathProtected = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_ADMIN) ||
  checkPathPrefix(pathname, pathForTag(TAG_HIDDEN)) ||
  pathname === PATH_OG;

export const getPathComponents = (pathname = ''): {
  photoId?: string
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  focal?: number
} => {
  const photoIdFromPhoto = pathname.match(
    new RegExp(`^${PREFIX_PHOTO}/([^/]+)`))?.[1];
  const photoIdFromTag = pathname.match(
    new RegExp(`^${PREFIX_TAG}/[^/]+/((?!${SHARE})[^/]+)`))?.[1];
  const photoIdFromCamera = pathname.match(
    new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/((?!${SHARE})[^/]+)`))?.[1];
  const photoIdFromFilmSimulation = pathname.match(
    new RegExp(`^${PREFIX_FILM_SIMULATION}/[^/]+/((?!${SHARE})[^/]+)`))?.[1];
  const photoIdFromFocalLength = pathname.match(
    new RegExp(`^${PREFIX_FOCAL_LENGTH}/[0-9]+mm/((?!${SHARE})[^/]+)`))?.[1];
  const tag = pathname.match(
    new RegExp(`^${PREFIX_TAG}/([^/]+)`))?.[1];
  const cameraMake = pathname.match(
    new RegExp(`^${PREFIX_CAMERA}/([^/]+)`))?.[1];
  const cameraModel = pathname.match(
    new RegExp(`^${PREFIX_CAMERA}/[^/]+/([^/]+)`))?.[1];
  const simulation = pathname.match(
    new RegExp(`^${PREFIX_FILM_SIMULATION}/([^/]+)`))?.[1] as FilmSimulation;
  const focalString = pathname.match(
    new RegExp(`^${PREFIX_FOCAL_LENGTH}/([0-9]+)mm`))?.[1];

  const camera = cameraMake && cameraModel
    ? { make: cameraMake, model: cameraModel }
    : undefined;

  const focal = focalString ? parseInt(focalString) : undefined;

  return {
    photoId: (
      photoIdFromPhoto ||
      photoIdFromTag ||
      photoIdFromCamera ||
      photoIdFromFilmSimulation ||
      photoIdFromFocalLength
    ),
    tag,
    camera,
    simulation,
    focal,
  };
};

export const getEscapePath = (pathname?: string) => {
  const {
    photoId,
    tag,
    camera,
    simulation,
    focal,
  } = getPathComponents(pathname);

  if (
    (photoId && isPathPhoto(pathname)) ||
    (tag && isPathTag(pathname)) ||
    (camera && isPathCamera(pathname)) ||
    (simulation && isPathFilmSimulation(pathname)) ||
    (focal && isPathFocalLength(pathname))
  ) {
    return PATH_GRID;
  } else if (photoId && isPathTagPhotoShare(pathname)) {
    return pathForPhoto({ photo: photoId, tag });
  } else if (photoId && isPathCameraPhotoShare(pathname)) {
    return pathForPhoto({ photo: photoId, camera });
  } else if (photoId && isPathFilmSimulationPhotoShare(pathname)) {
    return pathForPhoto({ photo: photoId, simulation });
  } else if (photoId && isPathFocalLengthPhotoShare(pathname)) {
    return pathForPhoto({ photo: photoId, focal });
  } else if (photoId && isPathPhotoShare(pathname)) {
    return pathForPhoto({ photo: photoId });
  } else if (tag && (
    isPathTagPhoto(pathname) ||
    isPathTagShare(pathname)
  )) {
    return pathForTag(tag);
  } else if (camera && (
    isPathCameraPhoto(pathname) ||
    isPathCameraShare(pathname)
  )) {
    return pathForCamera(camera);
  } else if (simulation && (
    isPathFilmSimulationPhoto(pathname) ||
    isPathFilmSimulationShare(pathname)
  )) {
    return pathForFilmSimulation(simulation);
  } else if (focal && (
    isPathFocalLengthPhoto(pathname) ||
    isPathFocalLengthShare(pathname)
  )) {
    return pathForFocalLength(focal);
  }
};
