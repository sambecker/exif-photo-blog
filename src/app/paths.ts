import { Photo } from '@/photo';
import { PhotoSetCategory } from '@/category';
import { BASE_URL, GRID_HOMEPAGE_ENABLED } from './config';
import { Camera } from '@/camera';
import { parameterize } from '@/utility/string';
import { TAG_HIDDEN } from '@/tag';
import { Lens } from '@/lens';

// Core paths
export const PATH_ROOT                  = '/';
export const PATH_GRID                  = '/grid';
export const PATH_FEED                  = '/feed';
export const PATH_ADMIN                 = '/admin';
export const PATH_API                   = '/api';
export const PATH_SIGN_IN               = '/sign-in';
export const PATH_OG                    = '/og';

export const PATH_GRID_INFERRED = GRID_HOMEPAGE_ENABLED
  ? PATH_ROOT
  : PATH_GRID;

export const PATH_FEED_INFERRED = GRID_HOMEPAGE_ENABLED
  ? PATH_FEED
  : PATH_ROOT;

// Path prefixes
export const PREFIX_PHOTO               = '/p';
export const PREFIX_CAMERA              = '/shot-on';
export const PREFIX_LENS                = '/lens';
export const PREFIX_TAG                 = '/tag';
export const PREFIX_RECIPE              = '/recipe';
export const PREFIX_FILM                = '/film';
export const PREFIX_FOCAL_LENGTH        = '/focal';

// Dynamic paths
const PATH_PHOTO_DYNAMIC                = `${PREFIX_PHOTO}/[photoId]`;
const PATH_CAMERA_DYNAMIC               = `${PREFIX_CAMERA}/[make]/[model]`;
const PATH_LENS_DYNAMIC                 = `${PREFIX_LENS}/[make]/[model]`;
const PATH_TAG_DYNAMIC                  = `${PREFIX_TAG}/[tag]`;
const PATH_FILM_DYNAMIC                 = `${PREFIX_FILM}/[film]`;
const PATH_FOCAL_LENGTH_DYNAMIC         = `${PREFIX_FOCAL_LENGTH}/[focal]`;
const PATH_RECIPE_DYNAMIC               = `${PREFIX_RECIPE}/[recipe]`;

// Admin paths
export const PATH_ADMIN_PHOTOS          = `${PATH_ADMIN}/photos`;
export const PATH_ADMIN_PHOTOS_UPDATES  = `${PATH_ADMIN_PHOTOS}/updates`;
export const PATH_ADMIN_UPLOADS         = `${PATH_ADMIN}/uploads`;
export const PATH_ADMIN_TAGS            = `${PATH_ADMIN}/tags`;
export const PATH_ADMIN_RECIPES         = `${PATH_ADMIN}/recipes`;
export const PATH_ADMIN_CONFIGURATION   = `${PATH_ADMIN}/configuration`;
export const PATH_ADMIN_INSIGHTS        = `${PATH_ADMIN}/insights`;
export const PATH_ADMIN_BASELINE        = `${PATH_ADMIN}/baseline`;
export const PATH_ADMIN_COMPONENTS      = `${PATH_ADMIN}/components`;

// Debug paths
export const PATH_OG_ALL                = `${PATH_OG}/all`;
export const PATH_OG_SAMPLE             = `${PATH_OG}/sample`;

// API paths
export const PATH_API_STORAGE = `${PATH_API}/storage`;
export const PATH_API_VERCEL_BLOB_UPLOAD = `${PATH_API_STORAGE}/vercel-blob`;
export const PATH_API_PRESIGNED_URL = `${PATH_API_STORAGE}/presigned-url`;

// Modifiers
const EDIT  = 'edit';

// Special characters
export const MISSING_FIELD = '-';

export const PATHS_ADMIN = [
  PATH_ADMIN,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_PHOTOS_UPDATES,
  PATH_ADMIN_UPLOADS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_RECIPES,
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
  PATH_CAMERA_DYNAMIC,
  PATH_LENS_DYNAMIC,
  PATH_TAG_DYNAMIC,
  PATH_FILM_DYNAMIC,
  PATH_FOCAL_LENGTH_DYNAMIC,
  PATH_RECIPE_DYNAMIC,
  ...PATHS_ADMIN,
];

type PhotoPathParams  = { photo: PhotoOrPhotoId } & PhotoSetCategory & {
  showRecipe?: boolean
};

export const pathForAdminUploadUrl = (url: string) =>
  `${PATH_ADMIN_UPLOADS}/${encodeURIComponent(url)}`;

export const pathForAdminPhotoEdit = (photo: PhotoOrPhotoId) =>
  `${PATH_ADMIN_PHOTOS}/${getPhotoId(photo)}/${EDIT}`;

export const pathForAdminTagEdit = (tag: string) =>
  `${PATH_ADMIN_TAGS}/${tag}/${EDIT}`;

export const pathForAdminRecipeEdit = (recipe: string) =>
  `${PATH_ADMIN_RECIPES}/${recipe}/${EDIT}`;

type PhotoOrPhotoId = Photo | string;

const getPhotoId = (photoOrPhotoId: PhotoOrPhotoId) =>
  typeof photoOrPhotoId === 'string' ? photoOrPhotoId : photoOrPhotoId.id;

export const pathForPhoto = ({
  photo,
  camera,
  lens,
  tag,
  film,
  focal,
  recipe,
}: PhotoPathParams) => {
  let prefix = PREFIX_PHOTO;

  if (typeof photo !== 'string' && photo.hidden) {
    prefix = pathForTag(TAG_HIDDEN);
  } else if (camera) {
    prefix = pathForCamera(camera);
  } else if (lens) {
    prefix = pathForLens(lens);
  } else if (tag) {
    prefix = pathForTag(tag);
  } else if (recipe) {
    prefix = pathForRecipe(recipe);
  } else if (film) {
    prefix = pathForFilm(film);
  } else if (focal) {
    prefix = pathForFocalLength(focal);
  }

  return `${prefix}/${getPhotoId(photo)}`;
};

export const pathForTag = (tag: string) =>
  `${PREFIX_TAG}/${tag}`;

export const pathForCamera = ({ make, model }: Camera) =>
  `${PREFIX_CAMERA}/${parameterize(make)}/${parameterize(model)}`;

export const pathForFilm = (film: string) =>
  `${PREFIX_FILM}/${film}`;

export const pathForLens = ({ make, model }: Lens) =>
  make
    ? `${PREFIX_LENS}/${parameterize(make)}/${parameterize(model)}`
    : `${PREFIX_LENS}/${MISSING_FIELD}/${parameterize(model)}`;

export const pathForFocalLength = (focal: number) =>
  `${PREFIX_FOCAL_LENGTH}/${focal}mm`;

export const pathForRecipe = (recipe: string) =>
  `${PREFIX_RECIPE}/${recipe}`;

// Absolute paths
export const ABSOLUTE_PATH_FOR_HOME_IMAGE = `${BASE_URL}/home-image`;

export const absolutePathForPhoto = (params: PhotoPathParams) =>
  `${BASE_URL}${pathForPhoto(params)}`;

export const absolutePathForTag = (tag: string) =>
  `${BASE_URL}${pathForTag(tag)}`;

export const absolutePathForCamera= (camera: Camera) =>
  `${BASE_URL}${pathForCamera(camera)}`;

export const absolutePathForLens= (lens: Lens) =>
  `${BASE_URL}${pathForLens(lens)}`;

export const absolutePathForFilm = (film: string) =>
  `${BASE_URL}${pathForFilm(film)}`;

export const absolutePathForRecipe = (recipe: string) =>
  `${BASE_URL}${pathForRecipe(recipe)}`;

export const absolutePathForFocalLength = (focal: number) =>
  `${BASE_URL}${pathForFocalLength(focal)}`;

export const absolutePathForPhotoImage = (photo: PhotoOrPhotoId) =>
  `${absolutePathForPhoto({ photo })}/image`;

export const absolutePathForTagImage = (tag: string) =>
  `${absolutePathForTag(tag)}/image`;

export const absolutePathForCameraImage= (camera: Camera) =>
  `${absolutePathForCamera(camera)}/image`;

export const absolutePathForLensImage= (lens: Lens) =>
  `${absolutePathForLens(lens)}/image`;

export const absolutePathForFilmImage = (film: string) =>
  `${absolutePathForFilm(film)}/image`;

export const absolutePathForRecipeImage = (recipe: string) =>
  `${absolutePathForRecipe(recipe)}/image`;

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

// film/[film]
export const isPathFilm = (pathname = '') =>
  new RegExp(`^${PREFIX_FILM}/[^/]+/?$`).test(pathname);

// film/[film]/[photoId]
export const isPathFilmPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_FILM}/[^/]+/[^/]+/?$`).test(pathname);

// focal/[focal]
export const isPathFocalLength = (pathname = '') =>
  new RegExp(`^${PREFIX_FOCAL_LENGTH}/[^/]+/?$`).test(pathname);

// focal/[focal]/[photoId]
export const isPathFocalLengthPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_FOCAL_LENGTH}/[^/]+/[^/]+/?$`).test(pathname);

export const checkPathPrefix = (pathname = '', prefix: string) =>
  pathname.toLowerCase().startsWith(prefix);

export const isPathRoot = (pathname?: string) =>
  pathname === PATH_ROOT;

export const isPathGrid = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_GRID);

export const isPathFeed = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_FEED);

export const isPathTopLevel = (pathname?: string) =>
  isPathRoot(pathname)||
  isPathGrid(pathname) ||
  isPathFeed(pathname);

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
  const photoIdFromFilm = pathname.match(
    new RegExp(`^${PREFIX_FILM}/[^/]+/([^/]+)`))?.[1];
  const photoIdFromFocalLength = pathname.match(
    new RegExp(`^${PREFIX_FOCAL_LENGTH}/[0-9]+mm/([^/]+)`))?.[1];
  const tag = pathname.match(
    new RegExp(`^${PREFIX_TAG}/([^/]+)`))?.[1];
  const cameraMake = pathname.match(
    new RegExp(`^${PREFIX_CAMERA}/([^/]+)`))?.[1];
  const cameraModel = pathname.match(
    new RegExp(`^${PREFIX_CAMERA}/[^/]+/([^/]+)`))?.[1];
  const film = pathname.match(
    new RegExp(`^${PREFIX_FILM}/([^/]+)`))?.[1] as string;
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
      photoIdFromFilm ||
      photoIdFromFocalLength
    ),
    tag,
    camera,
    film,
    focal,
  };
};

export const getEscapePath = (pathname?: string) => {
  const {
    photoId,
    tag,
    camera,
    film,
    focal,
  } = getPathComponents(pathname);

  if (
    (photoId && isPathPhoto(pathname)) ||
    (tag && isPathTag(pathname)) ||
    (camera && isPathCamera(pathname)) ||
    (film && isPathFilm(pathname)) ||
    (focal && isPathFocalLength(pathname))
  ) {
    return PATH_ROOT;
  } else if (tag && isPathTagPhoto(pathname)) {
    return pathForTag(tag);
  } else if (camera && isPathCameraPhoto(pathname)) {
    return pathForCamera(camera);
  } else if (film && isPathFilmPhoto(pathname)) {
    return pathForFilm(film);
  } else if (focal && isPathFocalLengthPhoto(pathname)) {
    return pathForFocalLength(focal);
  }
};
