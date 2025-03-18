import { Photo } from '.';
import { Camera, Cameras } from '@/camera';
import { PhotoDateRange } from '.';
import { FilmSimulation, FilmSimulations } from '@/simulation';
import { Lens, Lenses } from '@/lens';
import { Tags } from '@/tag';
import { FocalLengths } from '@/focal';
import { Recipes } from '@/recipe';
import {
  CATEGORY_VISIBILITY,
  IS_PRODUCTION,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORIES,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES,
} from '@/app/config';

const CATEGORY_KEYS = [
  'cameras',
  'lenses',
  'tags',
  'recipes',
  'films',
  'focal-lengths',
] as const;

type CategoryKey = (typeof CATEGORY_KEYS)[number];

type CategoryKeys = CategoryKey[];

export const DEFAULT_CATEGORY_KEYS: CategoryKeys = [
  'tags',
  'cameras',
  'recipes',
  'films',
];

export const shouldGenerateStaticParamsForCategory = (
  key: CategoryKey,
  type: 'page' | 'image',
): boolean =>
  CATEGORY_VISIBILITY.includes(key) &&
  IS_PRODUCTION && (
    (type === 'page' && STATICALLY_OPTIMIZED_PHOTO_CATEGORIES) ||
    (type === 'image' && STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES)
  );

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
