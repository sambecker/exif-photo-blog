import { createPhotoAction } from '@/photo/actions';
import { getPhoto, insertPhoto } from '@/photo/query';
import { copyFile, moveFile, deleteFile } from '@/platforms/storage';
import { addAlbumTitlesToPhoto } from '@/album/server';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { PhotoDbInsert } from '@/photo';

jest.mock('../src/auth/server', () => ({
  runAuthenticatedAdminServerAction: (callback: () => unknown) => callback(),
}));
jest.mock('../src/app/config', () => ({
  BLUR_ENABLED: false, AI_CONTENT_GENERATION_ENABLED: false,
  GEO_PRIVACY_ENABLED: false, AI_TEXT_AUTO_GENERATED_FIELDS: [],
  getBaseUrl: () => 'https://photos.example',
}));
jest.mock('../src/photo/query', () => ({
  getPhoto: jest.fn(), insertPhoto: jest.fn(),
  getRecipeTitleForData: jest.fn().mockResolvedValue('kodachrome'),
}));
jest.mock('../src/album/server', () => ({
  addAlbumTitlesToPhoto: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../src/photo/cache', () => ({}));
jest.mock('../src/cache', () => ({ revalidateAllKeysAndPaths: jest.fn() }));
jest.mock('../src/platforms/openai', () => ({}));
jest.mock('@ai-sdk/rsc', () => ({}));
jest.mock('../src/photo/ai/server', () => ({}));
jest.mock('../src/photo/color/server', () => ({}));
jest.mock('next/navigation', () => ({
  redirect: () => { throw new Error('NEXT_REDIRECT'); },
}));
jest.mock('next/server', () => ({ after: jest.fn() }));
jest.mock('../src/platforms/storage', () => ({
  copyFile: jest.fn(), moveFile: jest.fn(), deleteFile: jest.fn(),
  putFile: jest.fn().mockResolvedValue('https://photos.example/optimized.jpg'),
  generateFileNameWithId: () => 'photo-saved',
  getFileNamePartsFromStorageUrl: () => ({
    fileExtension: 'jpeg', fileNameBase: 'photo-fixture',
  }),
}));
jest.mock('../src/photo/server', () => ({
  ...jest.requireActual('../src/photo/server'),
  fetchImageUrlSafely: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
  resizeImageToBytes: jest.fn().mockResolvedValue(Buffer.from('jpeg')),
}));

const uploadUrl = 'https://photos.example/upload-original.jpeg';
const photoUrl = 'https://photos.example/photo-saved.jpeg';
const recipe: FujifilmRecipe = {
  dynamicRange: { range: 'standard', setting: 'auto', development: 100 },
  whiteBalance: { type: 'auto', red: 2, blue: -3 },
  grainEffect: { roughness: 'off', size: 'off' },
};
const form = () => {
  const data = new FormData();
  Object.entries({
    id: 'newphoto', url: uploadUrl, extension: 'jpeg',
    title: 'Red Folding Chairs', tags: 'patio, bench',
    make: 'FUJIFILM', model: 'X100VI', film: 'classic-chrome',
    takenAt: '2026-11-01T07:11:46Z',
    takenAtNaive: '2026-11-01 07:11:46',
    recipeData: JSON.stringify(recipe),
  }).forEach(([key, value]) => data.set(key, value));
  return data;
};

let uploadExists: boolean;
let saved: PhotoDbInsert | undefined;
beforeEach(() => {
  jest.clearAllMocks();
  uploadExists = true;
  saved = undefined;
  jest.mocked(getPhoto).mockImplementation(async () => saved as
    Awaited<ReturnType<typeof getPhoto>>);
  const copy = async () => {
    if (!uploadExists) { throw new Error('NoSuchKey'); }
    return photoUrl;
  };
  jest.mocked(copyFile).mockImplementation(copy);
  jest.mocked(moveFile).mockImplementation(async () => {
    const url = await copy();
    uploadExists = false;
    return url;
  });
  jest.mocked(deleteFile).mockImplementation(async () => {
    uploadExists = false;
  });
  jest.mocked(insertPhoto).mockImplementation(async photo => {
    saved = photo;
  });
});

it('retries a completed Add without moving the upload or duplicating the photo',
  async () => {
    await expect(createPhotoAction(form())).rejects.toThrow('NEXT_REDIRECT');
    expect(saved).toMatchObject({
      title: 'Red Folding Chairs', tags: ['patio', 'bench'],
      recipeTitle: 'kodachrome',
      recipeData: JSON.stringify(recipe),
    });
    await expect(createPhotoAction(form())).rejects.toThrow('NEXT_REDIRECT');
    expect(insertPhoto).toHaveBeenCalledTimes(1);
  },
);

it('keeps the upload after a database save failure', async () => {
  jest.mocked(insertPhoto).mockRejectedValueOnce(new Error('Database offline'));
  await expect(createPhotoAction(form())).rejects.toThrow('Database offline');
  expect(uploadExists).toBe(true);
  await expect(createPhotoAction(form())).rejects.toThrow('NEXT_REDIRECT');
});

it('keeps the upload available when adding albums fails', async () => {
  jest.mocked(addAlbumTitlesToPhoto)
    .mockRejectedValueOnce(new Error('Album failed'));
  await expect(createPhotoAction(form())).rejects.toThrow('Album failed');
  expect(uploadExists).toBe(true);
  await expect(createPhotoAction(form())).rejects.toThrow('NEXT_REDIRECT');
  expect(insertPhoto).toHaveBeenCalledTimes(1);
  expect(uploadExists).toBe(false);
});
