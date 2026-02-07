import { getTopNonFavTags, tagsHaveFavs } from '@/tag';
import { PhotoSetCategories } from '@/category';
import {
  SHOW_ALBUMS,
  SHOW_CAMERAS,
  SHOW_FILMS,
  SHOW_FOCAL_LENGTHS,
  SHOW_LENSES,
  SHOW_RECENTS,
  SHOW_RECIPES,
  SHOW_TAGS,
} from '@/app/config';

const MAX_ALBUM_TAG_COUNT = 3;
const MINIMUM_TOP_ENTITIES = 3;

export const getTopEntities = ({
  tags,
  recents,
  albums,
  recipes,
  films,
  focalLengths,
  cameras,
  lenses,
}: PhotoSetCategories) => ({
  hasFavs: tagsHaveFavs(tags),
  hasRecents: SHOW_RECENTS && recents.length > 0,
  albums: SHOW_ALBUMS ? albums.slice(0, MAX_ALBUM_TAG_COUNT) : [],
  tags: SHOW_TAGS ? getTopNonFavTags(tags).slice(0, MAX_ALBUM_TAG_COUNT) : [],
  recipe: SHOW_RECIPES ? recipes[0]?.recipe : undefined,
  film: SHOW_FILMS ? films[0]?.film : undefined,
  focal: SHOW_FOCAL_LENGTHS ? focalLengths[0]?.focal : undefined,
  camera: SHOW_CAMERAS ? cameras[0]?.camera : undefined,
  lens: SHOW_LENSES ? lenses[0]?.lens : undefined,
});

export const hasEnoughTopEntities = (categories: PhotoSetCategories) => {
  const entityCount = Object.values(getTopEntities(categories))
    .reduce<number>((acc, entity) => {
      if (Array.isArray(entity)) {
        return acc + entity.length;
      } else {
        return Boolean(entity) ? acc + 1 : acc;
      }
    }, 0);

  return entityCount > MINIMUM_TOP_ENTITIES;
};
