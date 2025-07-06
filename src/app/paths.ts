import { Photo } from '@/photo';
import { PhotoSetCategory } from '@/category';
import { getBaseUrl, GRID_HOMEPAGE_ENABLED } from './config';
import { Camera } from '@/camera';
import { parameterize } from '@/utility/string';
import { TAG_PRIVATE } from '@/tag';
import { Lens } from '@/lens';

// Core
export const PATH_ROOT                  = '/';
export const PATH_GRID                  = '/grid';
export const PATH_FULL                  = '/full';
export const PATH_ADMIN                 = '/admin';
export const PATH_API                   = '/api';
export const PATH_SIGN_IN               = '/sign-in';
export const PATH_OG                    = '/og';

// Core: inferred
export const PATH_GRID_INFERRED = GRID_HOMEPAGE_ENABLED
  ? PATH_ROOT
  : PATH_GRID;
export const PATH_FULL_INFERRED = GRID_HOMEPAGE_ENABLED
  ? PATH_FULL
  : PATH_ROOT;

// Sort
export const PARAM_SORT_TYPE_TAKEN_AT = 'taken-at';
export const PARAM_SORT_TYPE_UPLOADED_AT = 'uploaded-at';
export const PARAM_SORT_ORDER_NEWEST = 'newest-first';
export const PARAM_SORT_ORDER_OLDEST = 'oldest-first';
export const doesPathOfferSort = (pathname: string) =>
  pathname === PATH_ROOT ||
  pathname.startsWith(PATH_GRID) ||
  pathname.startsWith(PATH_FULL);

// Feeds
export const PATH_SITEMAP               = '/sitemap.xml';
export const PATH_RSS_XML               = '/rss.xml';
export const PATH_FEED_JSON             = '/feed.json';

// Path prefixes
export const PREFIX_PHOTO               = '/p';
export const PREFIX_CAMERA              = '/shot-on';
export const PREFIX_LENS                = '/lens';
export const PREFIX_TAG                 = '/tag';
export const PREFIX_RECIPE              = '/recipe';
export const PREFIX_FILM                = '/film';
export const PREFIX_FOCAL_LENGTH        = '/focal';
export const PREFIX_YEAR                = '/year';
export const PREFIX_RECENTS             = '/recents';

// Dynamic paths
const PATH_PHOTO_DYNAMIC                = `${PREFIX_PHOTO}/[photoId]`;
const PATH_CAMERA_DYNAMIC               = `${PREFIX_CAMERA}/[make]/[model]`;
const PATH_LENS_DYNAMIC                 = `${PREFIX_LENS}/[make]/[model]`;
const PATH_TAG_DYNAMIC                  = `${PREFIX_TAG}/[tag]`;
const PATH_FILM_DYNAMIC                 = `${PREFIX_FILM}/[film]`;
const PATH_FOCAL_LENGTH_DYNAMIC         = `${PREFIX_FOCAL_LENGTH}/[focal]`;
const PATH_RECIPE_DYNAMIC               = `${PREFIX_RECIPE}/[recipe]`;
const PATH_YEAR_DYNAMIC                 = `${PREFIX_YEAR}/[year]`;
const PATH_RECENTS_DYNAMIC              = `${PREFIX_RECENTS}/[photoId]`;

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
const EDIT = 'edit';
const IMAGE = 'image';
export const PARAM_UPLOAD_TITLE = 'title';

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
  PATH_FULL,
  PATH_OG,
  PATH_PHOTO_DYNAMIC,
  PATH_CAMERA_DYNAMIC,
  PATH_LENS_DYNAMIC,
  PATH_TAG_DYNAMIC,
  PATH_FILM_DYNAMIC,
  PATH_FOCAL_LENGTH_DYNAMIC,
  PATH_RECIPE_DYNAMIC,
  PATH_YEAR_DYNAMIC,
  PATH_RECENTS_DYNAMIC,
  ...PATHS_ADMIN,
];

type PhotoPathParams  = { photo: PhotoOrPhotoId } & PhotoSetCategory & {
  showRecipe?: boolean
};

export const pathForAdminUploadUrl = (url: string, title?: string) =>
  // eslint-disable-next-line max-len
  `${PATH_ADMIN_UPLOADS}/${encodeURIComponent(url)}${title ? `?${PARAM_UPLOAD_TITLE}=${encodeURIComponent(title)}` : ''}`;

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
  recent,
  year,
  camera,
  lens,
  tag,
  film,
  focal,
  recipe,
}: PhotoPathParams) => {
  let prefix = PREFIX_PHOTO;

  if (typeof photo !== 'string' && photo.hidden) {
    prefix = pathForTag(TAG_PRIVATE);
  } else if (recent) {
    prefix = PREFIX_RECENTS;
  } else if (year) {
    prefix = pathForYear(year);
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

export const pathForCamera = ({ make, model }: Camera) =>
  `${PREFIX_CAMERA}/${parameterize(make)}/${parameterize(model)}`;

export const pathForLens = ({ make, model }: Lens) =>
  make
    ? `${PREFIX_LENS}/${parameterize(make)}/${parameterize(model)}`
    : `${PREFIX_LENS}/${MISSING_FIELD}/${parameterize(model)}`;

export const pathForTag = (tag: string) =>
  `${PREFIX_TAG}/${tag}`;

export const pathForRecipe = (recipe: string) =>
  `${PREFIX_RECIPE}/${recipe}`;

export const pathForFilm = (film: string) =>
  `${PREFIX_FILM}/${film}`;

export const pathForFocalLength = (focal: number) =>
  `${PREFIX_FOCAL_LENGTH}/${focal}mm`;

export const pathForYear = (year: string) =>
  `${PREFIX_YEAR}/${year}`;

// Image paths
const pathForImage = (path: string) =>
  `${path}/${IMAGE}`;

export const pathForPhotoImage = (photo: PhotoOrPhotoId) =>
  pathForImage(pathForPhoto({ photo }));

export const pathForCameraImage = (camera: Camera) =>
  pathForImage(pathForCamera(camera));

export const pathForLensImage = (lens: Lens) =>
  pathForImage(pathForLens(lens));

export const pathForTagImage = (tag: string) =>
  pathForImage(pathForTag(tag));

export const pathForRecipeImage = (recipe: string) =>
  pathForImage(pathForRecipe(recipe));

export const pathForFilmImage = (film: string) =>
  pathForImage(pathForFilm(film));

export const pathForFocalLengthImage = (focal: number) =>
  pathForImage(pathForFocalLength(focal));

export const pathForYearImage = (year: string) =>
  pathForImage(pathForYear(year));

export const pathForRecentsImage = () =>
  pathForImage(PREFIX_RECENTS);

// Absolute paths
export const ABSOLUTE_PATH_GRID =
  `${getBaseUrl()}${PATH_GRID}`;

export const ABSOLUTE_PATH_FULL =
  `${getBaseUrl()}${PATH_FULL}`;

export const ABSOLUTE_PATH_FEED_JSON =
  `${getBaseUrl()}${PATH_FEED_JSON}`;

export const ABSOLUTE_PATH_RSS_XML =
  `${getBaseUrl()}${PATH_RSS_XML}`;

export const ABSOLUTE_PATH_HOME_IMAGE =
  `${getBaseUrl()}/home-image`;

export const absolutePathForPhoto = (
  params: PhotoPathParams,
  share?: boolean,
) =>
  `${getBaseUrl(share)}${pathForPhoto(params)}`;

export const absolutePathForCamera= (camera: Camera, share?: boolean) =>
  `${getBaseUrl(share)}${pathForCamera(camera)}`;

export const absolutePathForLens= (lens: Lens, share?: boolean) =>
  `${getBaseUrl(share)}${pathForLens(lens)}`;

export const absolutePathForTag = (tag: string, share?: boolean) =>
  `${getBaseUrl(share)}${pathForTag(tag)}`;

export const absolutePathForRecipe = (recipe: string, share?: boolean) =>
  `${getBaseUrl(share)}${pathForRecipe(recipe)}`;

export const absolutePathForFilm = (film: string, share?: boolean) =>
  `${getBaseUrl(share)}${pathForFilm(film)}`;

export const absolutePathForFocalLength = (focal: number, share?: boolean) =>
  `${getBaseUrl(share)}${pathForFocalLength(focal)}`;

export const absolutePathForYear = (year: string, share?: boolean) =>
  `${getBaseUrl(share)}${pathForYear(year)}`;

export const absolutePathForRecents = (share?: boolean) =>
  `${getBaseUrl(share)}${PREFIX_RECENTS}`;

export const absolutePathForPhotoImage = (photo: PhotoOrPhotoId) =>
  `${getBaseUrl()}${pathForPhotoImage(photo)}`;

export const absolutePathForCameraImage= (camera: Camera) =>
  `${getBaseUrl()}${pathForCameraImage(camera)}`;

export const absolutePathForLensImage= (lens: Lens) =>
  `${getBaseUrl()}${pathForLensImage(lens)}`;

export const absolutePathForTagImage = (tag: string) =>
  `${getBaseUrl()}${pathForTagImage(tag)}`;

export const absolutePathForRecipeImage = (recipe: string) =>
  `${getBaseUrl()}${pathForRecipeImage(recipe)}`;

export const absolutePathForFilmImage = (film: string) =>
  `${getBaseUrl()}${pathForFilmImage(film)}`;

export const absolutePathForFocalLengthImage = (focal: number) =>
  `${getBaseUrl()}${pathForFocalLengthImage(focal)}`;

export const absolutePathForYearImage = (year: string, share?: boolean) =>
  `${getBaseUrl(share)}${pathForYearImage(year)}`;

export const absolutePathForRecentsImage = (share?: boolean) =>
  `${getBaseUrl(share)}${pathForRecentsImage()}`;

// p/[photoId]
export const isPathPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_PHOTO}/[^/]+/?$`).test(pathname);

// recents
export const isPathRecents = (pathname = '') =>
  new RegExp(`^${PREFIX_RECENTS}/?$`).test(pathname);

// recents/[photoId]
export const isPathRecentsPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_RECENTS}/[^/]+/?$`).test(pathname);

// year/[year]
export const isPathYear = (pathname = '') =>
  new RegExp(`^${PREFIX_YEAR}/[^/]+/?$`).test(pathname);

// year/[year]/[photoId]
export const isPathYearPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_YEAR}/[^/]+/[^/]+/?$`).test(pathname);

// shot-on/[make]/[model]
export const isPathCamera = (pathname = '') =>
  new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/?$`).test(pathname);

// shot-on/[make]/[model]/[photoId]
export const isPathCameraPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/[^/]+/?$`).test(pathname);

// lens/[make]/[model]
export const isPathLens = (pathname = '') =>
  new RegExp(`^${PREFIX_LENS}/[^/]+/[^/]+/?$`).test(pathname);

// lens/[make]/[model]/[photoId]
export const isPathLensPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_LENS}/[^/]+/[^/]+/[^/]+/?$`).test(pathname);

// tag/[tag]
export const isPathTag = (pathname = '') =>
  new RegExp(`^${PREFIX_TAG}/[^/]+/?$`).test(pathname);

// tag/[tag]/[photoId]
export const isPathTagPhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_TAG}/[^/]+/[^/]+/?$`).test(pathname);

// recipe/[recipe]
export const isPathRecipe = (pathname = '') =>
  new RegExp(`^${PREFIX_RECIPE}/[^/]+/?$`).test(pathname);

// recipe/[recipe]/[photoId]
export const isPathRecipePhoto = (pathname = '') =>
  new RegExp(`^${PREFIX_RECIPE}/[^/]+/[^/]+/?$`).test(pathname);

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

export const isPathFull = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_FULL);

export const isPathTopLevel = (pathname?: string) =>
  isPathRoot(pathname)||
  isPathGrid(pathname) ||
  isPathFull(pathname);

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
  checkPathPrefix(pathname, pathForTag(TAG_PRIVATE)) ||
  checkPathPrefix(pathname, PATH_OG);

export const getPathComponents = (pathname = ''): {
  photoId?: string
} & PhotoSetCategory => {
  const photoIdFromPhoto = pathname.match(
    new RegExp(`^${PREFIX_PHOTO}/([^/]+)`))?.[1];
  const photoIdFromCamera = pathname.match(
    new RegExp(`^${PREFIX_CAMERA}/[^/]+/[^/]+/([^/]+)`))?.[1];
  const cameraMake = pathname.match(
    new RegExp(`^${PREFIX_CAMERA}/([^/]+)`))?.[1];
  const cameraModel = pathname.match(
    new RegExp(`^${PREFIX_CAMERA}/[^/]+/([^/]+)`))?.[1];
  const photoIdFromTag = pathname.match(
    new RegExp(`^${PREFIX_TAG}/[^/]+/([^/]+)`))?.[1];
  const photoIdFromFilm = pathname.match(
    new RegExp(`^${PREFIX_FILM}/[^/]+/([^/]+)`))?.[1];
  const photoIdFromFocalLength = pathname.match(
    new RegExp(`^${PREFIX_FOCAL_LENGTH}/[0-9]+mm/([^/]+)`))?.[1];
  const photoIdFromYear = pathname.match(
    new RegExp(`^${PREFIX_YEAR}/[^/]+/([^/]+)`))?.[1];
  const photoIdFromRecents = pathname.match(
    new RegExp(`^${PREFIX_RECENTS}/([^/]+)`))?.[1];
  const tag = pathname.match(
    new RegExp(`^${PREFIX_TAG}/([^/]+)`))?.[1];
  const film = pathname.match(
    new RegExp(`^${PREFIX_FILM}/([^/]+)`))?.[1] as string;
  const focalString = pathname.match(
    new RegExp(`^${PREFIX_FOCAL_LENGTH}/([0-9]+)mm`))?.[1];
  const year = pathname.match(
    new RegExp(`^${PREFIX_YEAR}/([^/]+)`))?.[1];
  const recent = isPathRecents(pathname) ? true : undefined;

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
      photoIdFromFocalLength ||
      photoIdFromYear ||
      photoIdFromRecents
    ),
    tag,
    camera,
    film,
    focal,
    year,
    recent,
  };
};

export const getEscapePath = (pathname?: string) => {
  const {
    photoId,
    recent,
    year,
    camera,
    lens,
    tag,
    recipe,
    film,
    focal,
  } = getPathComponents(pathname);

  if (
    (photoId && isPathPhoto(pathname)) ||
    (recent && isPathRecents(pathname)) ||
    (year && isPathYear(pathname)) ||
    (camera && isPathCamera(pathname)) ||
    (lens && isPathLens(pathname)) ||
    (tag && isPathTag(pathname)) ||
    (film && isPathFilm(pathname)) ||
    (focal && isPathFocalLength(pathname)) ||
    (recipe && isPathRecipe(pathname))
  ) {
    return PATH_ROOT;
  } else if (recent && isPathRecentsPhoto(pathname)) {
    return PREFIX_RECENTS;
  } else if (year && isPathYearPhoto(pathname)) {
    return pathForYear(year);
  } else if (camera && isPathCameraPhoto(pathname)) {
    return pathForCamera(camera);
  } else if (lens && isPathLensPhoto(pathname)) {
    return pathForLens(lens);
  } else if (tag && isPathTagPhoto(pathname)) {
    return pathForTag(tag);
  } else if (recipe && isPathRecipePhoto(pathname)) {
    return pathForRecipe(recipe);
  } else if (film && isPathFilmPhoto(pathname)) {
    return pathForFilm(film);
  } else if (focal && isPathFocalLengthPhoto(pathname)) {
    return pathForFocalLength(focal);
  }
};
