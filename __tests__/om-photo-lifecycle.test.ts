import sharp from 'sharp';
import piexif from 'piexifjs';
import { replacePhotoStorageAction, syncPhotoAction } from '@/photo/actions';
import {
  getCustomRecipeTitleForData,
  getPhoto,
  updatePhoto,
} from '@/photo/query';
import { parsePhotoFromDb } from '@/photo';
import { fetchUrlWithByteLimit } from '@/utility/fetch';
import {
  createOmRecipeKey,
  getOmFocalLengthIn35MmFormat,
  getOmRecipeFromMakerNote,
} from '@/platforms/om-system/server';
import { OmRecipe, parseOmRecipe } from '@/platforms/om-system/recipe';
import { createOmRecipeData, getOmRecipe, parseRecipeData }
  from '@/recipe/serialization';
import { deleteFile } from '@/platforms/storage';

jest.mock('../src/auth/server', () => ({
  runAuthenticatedAdminServerAction: (callback: () => unknown) => callback(),
}));
jest.mock('../src/app/config', () => ({
  BLUR_ENABLED: false,
  AI_CONTENT_GENERATION_ENABLED: false,
  GEO_PRIVACY_ENABLED: false,
  AI_TEXT_AUTO_GENERATED_FIELDS: [],
  getBaseUrl: () => 'https://photos.example',
}));
jest.mock('../src/photo/query', () => ({
  getPhoto: jest.fn(), updatePhoto: jest.fn().mockResolvedValue(undefined),
  getUniqueTags: jest.fn().mockResolvedValue([]),
  getCustomRecipeTitleForData: jest.fn(),
}));
jest.mock('../src/photo/cache', () => ({ revalidatePhoto: jest.fn() }));
jest.mock('../src/cache', () => ({ revalidateAllKeysAndPaths: jest.fn() }));
jest.mock('../src/utility/fetch', () => ({ fetchUrlWithByteLimit: jest.fn() }));
jest.mock('../src/platforms/om-system/server', () => ({
  ...jest.requireActual('../src/platforms/om-system/server'),
  getOmRecipeFromMakerNote: jest.fn(),
  getOmFocalLengthIn35MmFormat: jest.fn(),
}));
jest.mock('../src/photo/color/server', () => ({
  getColorFieldsForPhotoForm: jest.fn(),
}));
jest.mock('../src/photo/ai/server', () => ({
  generateAiImageQueries: jest.fn().mockResolvedValue({}),
}));
jest.mock('../src/photo/update/server', () => ({
  shouldBackfillPhotoStorage: jest.fn().mockResolvedValue(false),
}));
jest.mock('../src/photo/storage/server', () => ({
  storeOptimizedPhotosForUrl: jest.fn(),
}));
jest.mock('../src/photo/storage', () => ({
  getStorageUrlsForPhoto: jest.fn().mockResolvedValue([]),
}));
jest.mock('../src/platforms/storage', () => ({
  getFileNamePartsFromStorageUrl: () => ({ fileExtension: 'jpg' }),
  deleteFile: jest.fn(),
}));
jest.mock('../src/platforms/openai', () => ({}));
jest.mock('@ai-sdk/rsc', () => ({}));
jest.mock('next/server', () => ({ after: jest.fn() }));

const color: OmRecipe = {
  version: 1, kind: 'color', colors: Array(12).fill(0),
  whiteBalance: { mode: 1, amber: 2, green: -3 },
  tone: { shadow: -4, mid: 0, highlight: 4 },
  shading: 3, sharpness: 0, contrast: 0,
};
const mono: OmRecipe = {
  ...color, kind: 'mono', filter: { color: 1, strength: 3 },
  grain: 'medium', hue: 'normal',
};
let strippedJpeg: Buffer;
let penJpeg: Buffer;

beforeAll(async () => {
  strippedJpeg = await sharp({ create: {
    width: 8, height: 6, channels: 3, background: '#444444',
  } }).jpeg().toBuffer();
  // Only camera identification and a dummy binary MakerNote are needed here.
  // The real numeric decoder has its own original-derived fixture coverage.
  const exif = piexif.dump({
    '0th': {
      [piexif.ImageIFD.Make]: 'OM Digital Solutions',
      [piexif.ImageIFD.Model]: 'PEN',
    },
    Exif: {
      [piexif.ExifIFD.MakerNote]: 'fixture',
      [piexif.ExifIFD.FocalLength]: [25, 1],
    },
  });
  penJpeg = Buffer.from(
    piexif.insert(exif, strippedJpeg.toString('binary')), 'binary',
  );
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getPhoto).mockResolvedValue(parsePhotoFromDb({
    id: 'penphoto', url: 'https://photos.example/original.jpg',
    extension: 'jpg', title: 'Keep this title', tags: ['keep-tag'],
    make: 'OM Digital Solutions', model: 'PEN', aspectRatio: 4 / 3,
    takenAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    takenAtNaive: '2026-10-20 12:00:00',
    recipeData: JSON.stringify(createOmRecipeData(color)),
    recipeTitle: createOmRecipeKey(color),
  }));
  jest.mocked(getOmRecipeFromMakerNote).mockReturnValue(mono);
  jest.mocked(getOmFocalLengthIn35MmFormat).mockReturnValue(undefined);
  jest.mocked(fetchUrlWithByteLimit).mockImplementation(async () =>
    Uint8Array.from(penJpeg).buffer);
});

it('fills a missing 35mm equivalent during only-missing Sync without a recipe',
  async () => {
    jest.mocked(getOmRecipeFromMakerNote).mockReturnValueOnce(undefined);
    jest.mocked(getOmFocalLengthIn35MmFormat).mockReturnValueOnce(50);
    await syncPhotoAction('penphoto', { syncMode: 'only-missing' });
    expect(updatePhoto).toHaveBeenCalledWith(expect.objectContaining({
      focalLength: 25, focalLengthIn35MmFormat: 50,
    }));
    expect(jest.mocked(getOmFocalLengthIn35MmFormat).mock.calls[0]
      .slice(0, 2)).toEqual([Buffer.from('fixture'), 25]);
  },
);

it('keeps an explicit 35mm equivalent instead of deriving one', async () => {
  const exif = piexif.dump({
    '0th': { [piexif.ImageIFD.Make]: 'OM Digital Solutions' },
    Exif: {
      [piexif.ExifIFD.MakerNote]: 'fixture',
      [piexif.ExifIFD.FocalLength]: [25, 1],
      [piexif.ExifIFD.FocalLengthIn35mmFilm]: 60,
      [piexif.ExifIFD.DigitalZoomRatio]: [2, 1],
    },
  });
  const jpeg = Buffer.from(piexif.insert(exif,
    strippedJpeg.toString('binary')), 'binary');
  jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(
    Uint8Array.from(jpeg).buffer,
  );
  await syncPhotoAction('penphoto');
  expect(updatePhoto).toHaveBeenCalledWith(expect.objectContaining({
    focalLength: 25, focalLengthIn35MmFormat: 60,
  }));
  expect(getOmFocalLengthIn35MmFormat).not.toHaveBeenCalled();
});

it.each([
  ['auto', undefined, 68],
  ['auto', 80, 80],
  ['only-missing', undefined, 68],
  ['overwrite', 34, 68],
] as const)(
  '%s Sync derives a 2x zoom equivalent from %s to %i',
  async (syncMode, previousEquivalent, expectedEquivalent) => {
    const original = await getPhoto('penphoto');
    jest.mocked(getPhoto).mockResolvedValue({
      ...original!, focalLength: 17,
      focalLengthIn35MmFormat: previousEquivalent,
    });
    const exif = piexif.dump({
      '0th': { [piexif.ImageIFD.Make]: 'OM Digital Solutions' },
      Exif: {
        [piexif.ExifIFD.MakerNote]: 'fixture',
        [piexif.ExifIFD.FocalLength]: [17, 1],
        [piexif.ExifIFD.DigitalZoomRatio]: [2, 1],
      },
    });
    const jpeg = Buffer.from(piexif.insert(exif,
      strippedJpeg.toString('binary')), 'binary');
    jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(
      Uint8Array.from(jpeg).buffer,
    );
    jest.mocked(getOmFocalLengthIn35MmFormat)
      .mockImplementation((_bytes, _focal, zoom) => zoom === 2 ? 68 : 34);
    await syncPhotoAction('penphoto', { syncMode });
    expect(updatePhoto).toHaveBeenCalledWith(expect.objectContaining({
      focalLength: 17,
      focalLengthIn35MmFormat: expectedEquivalent,
    }));
  },
);

it('replaces the color recipe with the re-uploaded mono recipe', async () => {
  await replacePhotoStorageAction('penphoto',
    'https://photos.example/replacement.jpg');
  const [photo] = jest.mocked(updatePhoto).mock.calls[0];
  expect(photo.url).toBe('https://photos.example/replacement.jpg');
  expect(photo.title).toBe('Keep this title');
  expect(photo.tags).toEqual(['keep-tag']);
  expect(getOmRecipe(parseRecipeData(photo.recipeData)))
    .toEqual(parseOmRecipe(mono));
  expect(photo.recipeTitle).toBe(createOmRecipeKey(mono));
  expect(photo.recipeTitle).not.toBe(createOmRecipeKey(color));
  expect(parseRecipeData(photo.recipeData)?.camera).toBe('om-system');
  expect(fetchUrlWithByteLimit).toHaveBeenCalledTimes(1);
});

it('clears the recipe when a replacement has no camera EXIF', async () => {
  jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(
    Uint8Array.from(strippedJpeg).buffer,
  );
  await replacePhotoStorageAction('penphoto',
    'https://photos.example/edited.jpg');
  expect(updatePhoto).toHaveBeenCalledWith(expect.objectContaining({
    recipeData: JSON.stringify(createOmRecipeData()), recipeTitle: undefined,
  }));
  expect(getOmRecipeFromMakerNote).not.toHaveBeenCalled();
});

it.each(['auto', 'only-missing'] as const)(
  'clears a stripped source recipe during %s Sync', async syncMode => {
    jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(
      Uint8Array.from(strippedJpeg).buffer,
    );
    await syncPhotoAction('penphoto', { syncMode });
    expect(updatePhoto).toHaveBeenCalledWith(expect.objectContaining({
      make: 'OM Digital Solutions', model: 'PEN',
      recipeData: JSON.stringify(createOmRecipeData()), recipeTitle: undefined,
    }));
  },
);

it.each(['auto', 'only-missing', 'overwrite'] as const)(
  'refreshes changed active settings during %s Sync', async syncMode => {
    await syncPhotoAction('penphoto', { syncMode });
    const [photo] = jest.mocked(updatePhoto).mock.calls[0];
    expect(getOmRecipe(parseRecipeData(photo.recipeData)))
      .toEqual(parseOmRecipe(mono));
    expect(photo.recipeTitle).toBe(createOmRecipeKey(mono));
    expect(parseRecipeData(photo.recipeData)?.camera).toBe('om-system');
  },
);

it('uses a custom title from matching photos during Sync', async () => {
  jest.mocked(getCustomRecipeTitleForData)
    .mockResolvedValueOnce('night-mono');
  await syncPhotoAction('penphoto', { syncMode: 'overwrite' });
  const [photo] = jest.mocked(updatePhoto).mock.calls[0];
  expect(photo.recipeTitle).toBe('night-mono');
  expect(getCustomRecipeTitleForData).toHaveBeenCalledWith(
    JSON.stringify(createOmRecipeData(mono)), undefined,
  );
});

it.each(['auto', 'overwrite'] as const)(
  'keeps a custom title for an unchanged recipe during %s Sync',
  async syncMode => {
    const original = await getPhoto('penphoto');
    jest.mocked(getPhoto).mockResolvedValue({
      ...original!, recipeTitle: 'street-color',
    });
    jest.mocked(getOmRecipeFromMakerNote).mockReturnValue(color);
    await syncPhotoAction('penphoto', { syncMode });
    const [photo] = jest.mocked(updatePhoto).mock.calls[0];
    expect(photo.recipeTitle).toBe('street-color');
  },
);

it('replaces a custom title when the recipe changes during Sync', async () => {
  const original = await getPhoto('penphoto');
  jest.mocked(getPhoto).mockResolvedValue({
    ...original!, recipeTitle: 'street-color',
  });
  await syncPhotoAction('penphoto');
  const [photo] = jest.mocked(updatePhoto).mock.calls[0];
  expect(photo.recipeTitle).toBe(createOmRecipeKey(mono));
});

it.each([
  ['OM Digital Solutions', 'OM-3'],
  ['OLYMPUS IMAGING CORP.', 'PEN-F'],
  ['OLYMPUS CORPORATION', 'E-P7'],
])('refreshes and clears %s / %s recipes during only-missing Sync',
  async (make, model) => {
    const original = await getPhoto('penphoto');
    jest.mocked(getPhoto).mockResolvedValue({ ...original!, make, model });
    const exif = piexif.dump({
      '0th': { [piexif.ImageIFD.Make]: make, [piexif.ImageIFD.Model]: model },
      Exif: { [piexif.ExifIFD.MakerNote]: 'fixture' },
    });
    const jpeg = Buffer.from(piexif.insert(exif,
      strippedJpeg.toString('binary')), 'binary');
    jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(
      Uint8Array.from(jpeg).buffer,
    );
    await syncPhotoAction('penphoto', { syncMode: 'only-missing' });
    const [photo] = jest.mocked(updatePhoto).mock.calls[0];
    expect(getOmRecipe(parseRecipeData(photo.recipeData)))
      .toEqual(parseOmRecipe(mono));
    expect(photo.recipeTitle).toBe(createOmRecipeKey(mono));

    jest.mocked(updatePhoto).mockClear();
    jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(
      Uint8Array.from(strippedJpeg).buffer,
    );
    await syncPhotoAction('penphoto', { syncMode: 'only-missing' });
    expect(updatePhoto).toHaveBeenCalledWith(expect.objectContaining({
      recipeData: JSON.stringify(createOmRecipeData()), recipeTitle: undefined,
    }));
  },
);

it.each([
  { action: 'replace', failure: 'download' },
  { action: 'replace', failure: 'decode' },
  { action: 'sync', failure: 'download' },
  { action: 'sync', failure: 'decode' },
])('keeps saved data after $action $failure failure',
  async ({ action, failure }) => {
    if (failure === 'download') {
      jest.mocked(fetchUrlWithByteLimit)
        .mockRejectedValue(new Error('Offline'));
    } else {
      jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(
        Uint8Array.from(Buffer.from('Invalid JPEG')).buffer,
      );
    }
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      await expect(action === 'replace'
        ? replacePhotoStorageAction('penphoto',
          'https://photos.example/replacement.jpg')
        : syncPhotoAction('penphoto')).rejects.toThrow(failure === 'download'
        ? 'Offline' : 'Error extracting image data');
      expect(updatePhoto).not.toHaveBeenCalled();
      expect(deleteFile).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  },
);
