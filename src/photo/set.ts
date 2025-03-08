import { Photo } from '.';
import { Camera, Cameras } from '@/camera';
import { PhotoDateRange } from '.';
import { FilmSimulation, FilmSimulations } from '@/simulation';
import { Lens } from '@/lens';
import { Tags } from '@/tag';
import { FocalLengths } from '@/focal';
import { Recipes } from '@/recipe';

const CATEGORY_KEYS = [
  'tags',
  'cameras',
  'recipes',
  'films',
  'focal-lengths',
  'lenses',
] as const;

type CategoryKey = (typeof CATEGORY_KEYS)[number];

type CategoryKeys = CategoryKey[];

export const DEFAULT_CATEGORY_KEYS: CategoryKeys = [
  'tags',
  'cameras',
  'recipes',
  'films',
];

export const getHiddenDefaultCategories = (keys: CategoryKeys): CategoryKeys =>
  DEFAULT_CATEGORY_KEYS.filter(key => !keys.includes(key));

export interface PhotoSetCategory {
  tag?: string
  camera?: Camera
  recipe?: string
  simulation?: FilmSimulation
  focal?: number
  lens?: Lens // Unimplemented as a set
}

export interface PhotoSetCategories {
  tags: Tags
  cameras: Cameras
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
