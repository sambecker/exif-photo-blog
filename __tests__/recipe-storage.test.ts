import {
  convertPhotoToPhotoDbInsert,
  parsePhotoFromDb,
  shouldShowRecipeDataForPhoto,
} from '@/photo';
import { getRecipePropsFromPhotos } from '@/recipe';
import {
  createOmRecipeData,
  getFujifilmRecipe,
  getOmRecipe,
  parseRecipeData,
} from '@/recipe/serialization';
import { OmRecipe } from '@/platforms/om-system/recipe';

const recipe: OmRecipe = {
  version: 1, kind: 'color', colors: Array(12).fill(0),
  whiteBalance: { mode: 1, amber: 2, green: -3 },
  tone: { shadow: -4, mid: 0, highlight: 4 },
  shading: 3, sharpness: 0, contrast: 0,
};
const base = {
  id: 'recipe01', url: 'https://example.test/photo.jpg', extension: 'jpg',
  aspectRatio: 4 / 3, tags: [], takenAt: new Date(), createdAt: new Date(),
  updatedAt: new Date(), takenAtNaive: '2026-10-29 12:00:00',
};
const fuji = {
  dynamicRange: { range: 'standard', setting: 'auto', development: 100 },
  whiteBalance: { type: 'auto', red: 2, blue: -3 },
  grainEffect: { roughness: 'off', size: 'off' },
};

it.each([fuji, { ...fuji, camera: 'fujifilm' }])(
  'reads legacy and tagged Fujifilm data through the existing viewer', data => {
    const photo = parsePhotoFromDb({
      ...base, recipeData: JSON.stringify(data), recipeTitle: 'classic',
      film: 'classic-chrome',
    });
    expect(getOmRecipe(photo.recipeData)).toBeUndefined();
    expect(getFujifilmRecipe(photo.recipeData)).toEqual(data);
    expect(getRecipePropsFromPhotos([photo])?.data).toEqual(data);
    expect(JSON.parse(convertPhotoToPhotoDbInsert(photo).recipeData!))
      .toEqual(data);
  },
);

it('uses shared fields and keeps OM data out of the Fujifilm viewer', () => {
  const data = createOmRecipeData(recipe);
  const photo = parsePhotoFromDb({
    ...base, recipeData: JSON.stringify(data), recipeTitle: 'om-key',
    // Even stale film metadata must not select the wrong recipe viewer.
    film: 'classic-chrome',
  });
  expect(getOmRecipe(photo.recipeData)).toEqual(recipe);
  expect(getFujifilmRecipe(photo.recipeData)).toBeUndefined();
  expect(getRecipePropsFromPhotos([photo])).toBeUndefined();
  expect(parseRecipeData(convertPhotoToPhotoDbInsert(photo).recipeData))
    .toEqual(data);
});

it('preserves an empty import result through edits without a viewer', () => {
  const data = createOmRecipeData();
  const photo = parsePhotoFromDb({
    ...base, recipeData: JSON.stringify(data),
  });
  expect(getOmRecipe(photo.recipeData)).toBeUndefined();
  expect(shouldShowRecipeDataForPhoto(photo)).toBe(false);
  expect(parseRecipeData(convertPhotoToPhotoDbInsert(photo).recipeData))
    .toEqual(data);
});

it.each(['invalid json', 'null', '[]', '{"camera":"unknown"}'])(
  'does not render malformed or unknown-brand data: %s', data => {
    expect(parseRecipeData(data)).toBeUndefined();
  },
);

it('rejects an incomplete OM profile without treating it as Fujifilm', () => {
  const data = parseRecipeData({
    camera: 'om-system', checkedVersion: 1, recipe: { kind: 'color' },
  });
  expect(getOmRecipe(data)).toBeUndefined();
  expect(getFujifilmRecipe(data)).toBeUndefined();
});
