import { Photo, PhotoDateRangePostgres } from '../photo';
import { Camera, Cameras } from '@/camera';
import { Films } from '@/film';
import { Lens, Lenses } from '@/lens';
import { Tags } from '@/tag';
import { FocalLengths } from '@/focal';
import { Recipes } from '@/recipe';
import { Recents } from '@/recents';
import { Years } from '@/year';
import { parseCommaSeparatedKeyString } from '@/utility/key';
import { Album, Albums } from '@/album';

export const CATEGORY_KEYS = [
  'recents',
  'years',
  'cameras',
  'lenses',
  'albums',
  'tags',
  'recipes',
  'films',
  'focal-lengths',
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export type CategoryKeys = CategoryKey[];

export const DEFAULT_CATEGORY_KEYS: CategoryKeys = [
  'recents',
  'albums',
  'tags',
  'cameras',
  'lenses',
  'recipes',
  'films',
];

export const parseOrderedCategoriesFromString = (
  string?: string,
) =>
  parseCommaSeparatedKeyString({
    string,
    acceptedKeys: CATEGORY_KEYS,
    defaultKeys: DEFAULT_CATEGORY_KEYS,
  });

export interface CategoryQueryMeta {
  count: number
  lastModified: Date
}

export const getHiddenDefaultCategories = (keys: CategoryKeys): CategoryKeys =>
  DEFAULT_CATEGORY_KEYS.filter(key => !keys.includes(key));

export interface PhotoSetCategory {
  recent?: boolean
  year?: string
  camera?: Camera
  lens?: Lens
  album?: Album
  tag?: string
  recipe?: string
  film?: string
  focal?: number
}

export interface PhotoSetCategories {
  recents: Recents
  years: Years
  cameras: Cameras
  lenses: Lenses
  albums: Albums
  tags: Tags
  recipes: Recipes
  films: Films
  focalLengths: FocalLengths
}

export interface PhotoSetAttributes {
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRangePostgres
}

export const sortCategoryByCount = (
  a: { count: number },
  b: { count: number },
) => b.count - a.count;

export const sortCategoriesByCount = <T extends { count: number }>(
  categories: T[],
) => categories.sort(sortCategoryByCount);

const convertCategoryKeysToCategoryNames =
  (categoryKeys: CategoryKeys): (keyof PhotoSetCategories)[] => {
    return categoryKeys.map(key => {
      return key === 'focal-lengths'
        ? 'focalLengths'
        : key;
    });
  };

export const getCategoryItemsCount = (
  categoryKeys: CategoryKeys,
  categories: PhotoSetCategories,
) =>
  convertCategoryKeysToCategoryNames(categoryKeys).reduce((acc, key) =>
    acc + (categories[key]?.length ?? 0)
  , 0);

export const getCategoriesWithItemsCount = (
  categoryKeys: CategoryKeys,
  categories: PhotoSetCategories,
) =>
  convertCategoryKeysToCategoryNames(categoryKeys).reduce((acc, key) =>
    (categories[key]?.length ?? 0) > 0
      ? acc + 1
      : acc
  , 0);
