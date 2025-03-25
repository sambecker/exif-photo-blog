import { Photo } from '../photo';
import { Camera, Cameras } from '@/camera';
import { PhotoDateRange } from '../photo';
import { FilmSimulation, FilmSimulations } from '@/simulation';
import { Lens, Lenses } from '@/lens';
import { Tags } from '@/tag';
import { FocalLengths } from '@/focal';
import { Recipes } from '@/recipe';

const CATEGORY_KEYS = [
  'cameras',
  'lenses',
  'tags',
  'recipes',
  'films',
  'focal-lengths',
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export type CategoryKeys = CategoryKey[];

export const DEFAULT_CATEGORY_KEYS: CategoryKeys = [
  'tags',
  'cameras',
  'lenses',
  'recipes',
  'films',
];

export const getHiddenCategories = (keys: CategoryKeys): CategoryKeys =>
  CATEGORY_KEYS.filter(key => !keys.includes(key));

export const getHiddenDefaultCategories = (keys: CategoryKeys): CategoryKeys =>
  DEFAULT_CATEGORY_KEYS.filter(key => !keys.includes(key));

export interface PhotoSetCategory {
  camera?: Camera
  lens?: Lens
  tag?: string
  recipe?: string
  simulation?: FilmSimulation
  focal?: number
}

export interface PhotoSetCategories {
  cameras: Cameras
  lenses: Lenses
  tags: Tags
  recipes: Recipes
  simulations: FilmSimulations
  focalLengths: FocalLengths
}

export interface PhotoSetAttributes {
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
}

export const getOrderedCategoriesFromString = (
  categories?: string,
): CategoryKeys =>
  categories
    ? categories
      .split(',')
      .map(category => category.trim().toLocaleLowerCase() as CategoryKey)
      .filter(category => CATEGORY_KEYS.includes(category))
    : DEFAULT_CATEGORY_KEYS;

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
      return key === 'films'
        ? 'simulations'
        : key === 'focal-lengths'
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
