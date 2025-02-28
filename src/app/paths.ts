import { Photo, PhotoSetCategory } from '@/photo';
import { BASE_URL, GRID_HOMEPAGE_ENABLED } from './config';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';
import { parameterize } from '@/utility/string';
import { TAG_HIDDEN } from '@/tag';

// Core paths
export const PATH_ROOT                = '/';
export const PATH_GRID                = '/grid';
export const PATH_FEED                = '/feed';
export const PATH_ADMIN               = '/admin';
export const PATH_API                 = '/api';
export const PATH_SIGN_IN             = '/sign-in';
export const PATH_OG                  = '/og';
// eslint-disable-next-line max-len
export const PATH_GRID_INFERRED       = GRID_HOMEPAGE_ENABLED ? PATH_ROOT : PATH_GRID;
// eslint-disable-next-line max-len
export const PATH_FEED_INFERRED       = GRID_HOMEPAGE_ENABLED ? PATH_FEED : PATH_ROOT;

// Path prefixes
export const PREFIX_PHOTO             = '/p';
export const PREFIX_TAG               = '/tag';
export const PREFIX_CAMERA            = '/shot-on';
export const PREFIX_FILM_SIMULATION   = '/film';
export const PREFIX_FOCAL_LENGTH      = '/focal';

// Dynamic paths
const PATH_PHOTO_DYNAMIC              = `${PREFIX_PHOTO}/[photoId]`;
const PATH_TAG_DYNAMIC                = `${PREFIX_TAG}/[tag]`;
const PATH_CAMERA_DYNAMIC             = `${PREFIX_CAMERA}/[make]/[model]`;
// eslint-disable-next-line max-len
const PATH_FILM_SIMULATION_DYNAMIC    = `${PREFIX_FILM_SIMULATION}/[simulation]`;
const PATH_FOCAL_LENGTH_DYNAMIC       = `${PREFIX_FOCAL_LENGTH}/[focal]`;

// Search params
export const SEARCH_PARAM_SHOW        = 'show';
export const SEARCH_PARAM_SHOW_RECIPE = 'recipe';

// Admin paths
export const PATH_ADMIN_PHOTOS        = `${PATH_ADMIN}/photos`;
export const PATH_ADMIN_OUTDATED      = `${PATH_ADMIN}/outdated`;
export const PATH_ADMIN_UPLOADS       = `${PATH_ADMIN}/uploads`;
export const PATH_ADMIN_TAGS          = `${PATH_ADMIN}/tags`;
export const PATH_ADMIN_CONFIGURATION = `${PATH_ADMIN}/configuration`;
export const PATH_ADMIN_INSIGHTS      = `${PATH_ADMIN}/insights`;
export const PATH_ADMIN_BASELINE      = `${PATH_ADMIN}/baseline`;
export const PATH_ADMIN_COMPONENTS    = `${PATH_ADMIN}/components`;

// Debug paths
export const PATH_OG_ALL              = `${PATH_OG}/all`;
export const PATH_OG_SAMPLE           = `${PATH_OG}/sample`;

// API paths
export const PATH_API_STORAGE = `${PATH_API}/storage`;
export const PATH_API_VERCEL_BLOB_UPLOAD = `${PATH_API_STORAGE}/vercel-blob`;
export const PATH_API_PRESIGNED_URL = `${PATH_API_STORAGE}/presigned-url`;

// Modifiers
const EDIT  = 'edit';

export const PATHS_ADMIN = [
  PATH_ADMIN,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_UPLOADS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_INSIGHTS,
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_BASELINE,
  PATH_ADMIN_COMPONENTS,
];

export const PATHS_TO_CACHE = [
  PATH_ROOT,
  PATH_GRID,
  PATH_FEED,
  PATH_OG,
  PATH_PHOTO_DYNAMIC,
  PATH_TAG_DYNAMIC,
  PATH_CAMERA_DYNAMIC,
  PATH_FILM_SIMULATION_DYNAMIC,
  PATH_FOCAL_LENGTH_DYNAMIC,
  ...PATHS_ADMIN,
];

type PhotoPathParams  = { photo: PhotoOrPhotoId } & PhotoSetCategory & {
  showRecipe?: boolean
};

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
  showRecipe,
}: PhotoPathParams) => {
  const path = typeof photo !== 'string' && photo.hidden
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
  return showRecipe
    ? `${path}?${SEARCH_PARAM_SHOW}=${SEARCH_PARAM_SHOW_RECIPE}`
    : path;
};

export const pathForTag = (tag: string) =>
  `${PREFIX_TAG}/${tag}`;

export const pathForCamera = ({ make, model }: Camera) =>
  `${PREFIX_CAMERA}/${parameterize(make, true)}/${parameterize(model, true)}`;

export const pathForFilmSimulation = (simulation: FilmSimulation) =>
  `${PREFIX_FILM_SIMULATION}/${simulation}`;

export const pathForFocalLength = (focal: number) =>
  `${PREFIX_FOCAL_LENGTH}/${focal}mm`;

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

// tag/[tag]
export const isPathTag = (pathname = '') =>
  new RegExp(`^${PREFIX_TAG}/[^/]+/?$`).test(pathname);;

// tag/[tag]/[photoId]
export const isPathTagPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_TAG}/[^/]+/[^/]+/?$`).test(pathname);

// shot-on/[make]/[model]
export const isPathCamera = (pathname = '') =>
  new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/?$`).test(pathname);

// shot-on/[make]/[model]/[photoId]
export const isPathCameraPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/[^/]+/?$`).test(pathname);

// film/[simulation]
export const isPathFilmSimulation = (pathname = '') =>
  new RegExp(`^${PREFIX_FILM_SIMULATION}/[^/]+/?$`).test(pathname);

// film/[simulation]/[photoId]
export const isPathFilmSimulationPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_FILM_SIMULATION}/[^/]+/[^/]+/?$`).test(pathname);

// focal/[focal]
export const isPathFocalLength = (pathname = '') =>
  new RegExp(`^${PREFIX_FOCAL_LENGTH}/[^/]+/?$`).test(pathname);

// focal/[focal]/[photoId]
export const isPathFocalLengthPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_FOCAL_LENGTH}/[^/]+/[^/]+/?$`).test(pathname);

export const checkPathPrefix = (pathname = '', prefix: string) =>
  pathname.toLowerCase().startsWith(prefix);

export const isPathGrid = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_GRID);

export const isPathFeed = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_FEED);

export const isPathSignIn = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_SIGN_IN);

export const isPathAdmin = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_ADMIN);

export const isPathTopLevelAdmin = (pathname?: string) =>
  PATHS_ADMIN.some(path => path === pathname);

export const isPathAdminPhotos = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_ADMIN_PHOTOS);

export const isPathAdminInsights = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_ADMIN_INSIGHTS);

export const isPathAdminConfiguration = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_ADMIN_CONFIGURATION);

export const isPathAdminInfo = (pathname?: string) =>
  isPathAdminInsights(pathname) ||
  isPathAdminConfiguration(pathname);

export const isPathProtected = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_ADMIN) ||
  checkPathPrefix(pathname, pathForTag(TAG_HIDDEN)) ||
  checkPathPrefix(pathname, PATH_OG);

export const getPathComponents = (pathname = ''): {
  photoId?: string
} & PhotoSetCategory => {
  const photoIdFromPhoto = pathname.match(
    new RegExp(`^${PREFIX_PHOTO}/([^/]+)`))?.[1];
  const photoIdFromTag = pathname.match(
    new RegExp(`^${PREFIX_TAG}/[^/]+/([^/]+)`))?.[1];
  const photoIdFromCamera = pathname.match(
    new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/([^/]+)`))?.[1];
  const photoIdFromFilmSimulation = pathname.match(
    new RegExp(`^${PREFIX_FILM_SIMULATION}/[^/]+/([^/]+)`))?.[1];
  const photoIdFromFocalLength = pathname.match(
    new RegExp(`^${PREFIX_FOCAL_LENGTH}/[0-9]+mm/([^/]+)`))?.[1];
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
    return PATH_ROOT;
  } else if (tag && isPathTagPhoto(pathname)) {
    return pathForTag(tag);
  } else if (camera && isPathCameraPhoto(pathname)) {
    return pathForCamera(camera);
  } else if (simulation && isPathFilmSimulationPhoto(pathname)) {
    return pathForFilmSimulation(simulation);
  } else if (focal && isPathFocalLengthPhoto(pathname)) {
    return pathForFocalLength(focal);
  }
};
