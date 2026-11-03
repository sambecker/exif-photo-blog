import {
  convertFormDataToPhotoDbInsertAndLookupRecipeTitle,
  propagateRecipeTitleIfNecessary,
} from '@/photo/server';
import {
  getCustomRecipeTitleForData,
  renameRecipeForMatchingPhotos,
} from '@/photo/query';
import {
  createFujifilmRecipeKey,
  createRecipeHashKey,
  createRecipeIdentityKey,
} from '@/recipe/server';
import {
  canCreateRecipeHashKey,
  isRecipeHashKey,
  RECIPE_HASH_KEY_PATTERN_DB,
} from '@/recipe/key';
import { formatRecipe } from '@/recipe';
import { createOmRecipeData } from '@/recipe/serialization';
import { createOmRecipeKey } from '@/platforms/om-system/server';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { OmRecipe } from '@/platforms/om-system/recipe';

jest.mock('../src/app/config', () => ({
  GEO_PRIVACY_ENABLED: false,
  getBaseUrl: () => 'https://photos.example',
}));
jest.mock('../src/photo/query', () => ({
  getCustomRecipeTitleForData: jest.fn(),
  renameRecipeForMatchingPhotos: jest.fn(),
}));
jest.mock('../src/platforms/storage', () => ({}));
jest.mock('../src/photo/color/server', () => ({}));
jest.mock('../src/platforms/openai', () => ({}));
jest.mock('@ai-sdk/rsc', () => ({}));
jest.mock('next/server', () => ({ after: jest.fn() }));

const fuji: FujifilmRecipe = {
  dynamicRange: { range: 'standard', setting: 'auto', development: 100 },
  whiteBalance: { type: 'auto', red: 2, blue: -3 },
  grainEffect: { roughness: 'off', size: 'off' },
  highlight: -1,
};
const om: OmRecipe = {
  version: 1, kind: 'color', colors: Array(12).fill(0),
  whiteBalance: { mode: 1, amber: 2, green: -3 },
  tone: { shadow: -4, mid: 0, highlight: 4 },
  shading: 3, sharpness: 0, contrast: 0,
};
const fujiData = JSON.stringify(fuji);
const fujiKey = createFujifilmRecipeKey(fuji, 'classic-chrome');
const omData = JSON.stringify(createOmRecipeData(om));
const omKey = createOmRecipeKey(om);
const photoForm = {
  id: 'photo01', url: 'https://example.test/photo.jpg', extension: 'jpg',
  aspectRatio: '1.5', takenAt: '2026-10-29T12:00:00Z',
  takenAtNaive: '2026-10-29 12:00:00',
};
const fujiForm = {
  ...photoForm, make: 'FUJIFILM', film: 'classic-chrome', recipeData: fujiData,
};
const omForm = {
  ...photoForm, make: 'OM Digital Solutions', recipeData: omData,
};

beforeEach(() => jest.clearAllMocks());

describe('recipe keys', () => {
  it('ignores key order and camera tags in Fujifilm recipe identity', () => {
    const reordered = JSON.parse(JSON.stringify({
      highlight: -1,
      grainEffect: { size: 'off', roughness: 'off' },
      whiteBalance: { blue: -3, red: 2, type: 'auto' },
      dynamicRange: { development: 100, setting: 'auto', range: 'standard' },
      camera: 'fujifilm',
    }));
    expect(createFujifilmRecipeKey(reordered, 'classic-chrome'))
      .toBe(fujiKey);
    expect(createRecipeIdentityKey(fujiData, 'classic-chrome')).toBe(fujiKey);
  });

  it('distinguishes Fujifilm recipes by film and settings', () => {
    expect(createFujifilmRecipeKey(fuji, 'acros')).not.toBe(fujiKey);
    expect(createFujifilmRecipeKey({ ...fuji, highlight: 1 },
      'classic-chrome')).not.toBe(fujiKey);
  });

  it('only generates titles for OM recipes', () => {
    expect(createRecipeHashKey(fujiData)).toBeUndefined();
    expect(canCreateRecipeHashKey(fujiData)).toBe(false);
    expect(createRecipeHashKey(omData)).toBe(omKey);
    expect(canCreateRecipeHashKey(omData)).toBe(true);
    expect(createRecipeIdentityKey(omData)).toBe(omKey);
    expect(createRecipeHashKey(JSON.stringify(createOmRecipeData())))
      .toBeUndefined();
  });

  it('recognizes generated keys in JS and Postgres patterns', () => {
    const pattern = new RegExp(RECIPE_HASH_KEY_PATTERN_DB);
    expect(isRecipeHashKey(omKey)).toBe(true);
    expect(pattern.test(omKey)).toBe(true);
    for (const key of ['street-color', fujiKey, `${omKey}-2`]) {
      expect(isRecipeHashKey(key)).toBe(false);
      expect(pattern.test(key)).toBe(false);
    }
  });

  it('labels generated keys generically', () => {
    expect(formatRecipe(omKey)).toBe('Color Recipe');
    expect(formatRecipe('street-color')).toBe('Street Color');
  });
});

describe('recipe titles on save', () => {
  it.each([
    ['Fujifilm', fujiForm],
    ['OM', omForm],
  ])('prefers a custom match for untitled %s recipes', async (_, form) => {
    jest.mocked(getCustomRecipeTitleForData)
      .mockResolvedValueOnce('street-color');
    const photo =
      await convertFormDataToPhotoDbInsertAndLookupRecipeTitle(form);
    expect(photo.recipeTitle).toBe('street-color');
  });

  it.each([
    ['Fujifilm', fujiForm, undefined],
    ['OM', omForm, omKey],
  ])('falls back to %s default titles', async (_, form, key) => {
    const photo =
      await convertFormDataToPhotoDbInsertAndLookupRecipeTitle(form);
    expect(photo.recipeTitle).toBe(key);
  });

  it.each([
    ['Fujifilm', fujiForm, undefined],
    ['OM', omForm, omKey],
  ])('derives submitted %s hash titles from data', async (_, form, key) => {
    const forged = `om-v1-mono-${'b'.repeat(64)}`;
    const photo = await convertFormDataToPhotoDbInsertAndLookupRecipeTitle({
      ...form, recipeTitle: forged,
    });
    expect(photo.recipeTitle).toBe(key);
    expect(getCustomRecipeTitleForData).not.toHaveBeenCalled();
  });

  it('keeps custom titles without searching', async () => {
    const photo = await convertFormDataToPhotoDbInsertAndLookupRecipeTitle({
      ...omForm, recipeTitle: 'Night Mono',
    });
    expect(photo.recipeTitle).toBe('night-mono');
    expect(getCustomRecipeTitleForData).not.toHaveBeenCalled();
  });

  it('renames matching photos only when the user changes the title',
    async () => {
      const formData = new FormData();
      formData.set('recipeTitle', 'Night Mono');
      const photo = await convertFormDataToPhotoDbInsertAndLookupRecipeTitle(
        { ...omForm, recipeTitle: 'Night Mono' },
      );
      await propagateRecipeTitleIfNecessary(formData, photo, 'night-mono');
      expect(renameRecipeForMatchingPhotos).not.toHaveBeenCalled();
      await propagateRecipeTitleIfNecessary(formData, photo, omKey);
      expect(renameRecipeForMatchingPhotos).toHaveBeenCalledWith({
        photoId: 'photo01', previousTitle: omKey, title: 'night-mono',
        recipeData: omData, film: undefined,
      });
      jest.mocked(renameRecipeForMatchingPhotos).mockClear();
      await propagateRecipeTitleIfNecessary(new FormData(), photo, omKey);
      expect(renameRecipeForMatchingPhotos).not.toHaveBeenCalled();
    },
  );
});
