/* eslint-disable @stylistic/max-len */
import { importOmRecipeAction } from '@/platforms/om-system/actions';
import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { getPhoto } from '@/photo/query';
import { revalidatePhoto } from '@/photo/cache';
import { fetchUrlWithByteLimit } from '@/utility/fetch';
import { getOmRecipeFromImage } from '@/platforms/om-system/server';
import { storeOmRecipe } from '@/platforms/om-system/query';

jest.mock('../src/auth/server', () => ({
  runAuthenticatedAdminServerAction: jest.fn((callback: () => unknown) =>
    callback()),
}));
jest.mock('../src/photo/query', () => ({ getPhoto: jest.fn() }));
jest.mock('../src/photo/cache', () => ({ revalidatePhoto: jest.fn() }));
jest.mock('../src/utility/fetch', () => ({ fetchUrlWithByteLimit: jest.fn() }));
jest.mock('../src/platforms/om-system/server', () => ({
  getOmRecipeFromImage: jest.fn(),
}));
jest.mock('../src/platforms/om-system/query', () => ({ storeOmRecipe: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getPhoto).mockResolvedValue({
    id: 'penphoto', make: 'OM Digital Solutions', model: 'PEN',
    url: 'https://photos.example/pen.jpg',
  } as Awaited<ReturnType<typeof getPhoto>>);
  jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(new ArrayBuffer(8));
  jest.mocked(getOmRecipeFromImage).mockReturnValue({
    isOmCamera: true, recipe: undefined,
  });
  jest.mocked(storeOmRecipe).mockResolvedValue(undefined);
});

describe('OM recipe import', () => {
  it.each([
    ['OM Digital Solutions', 'OM-3'],
    ['OLYMPUS IMAGING CORP.', 'PEN-F'],
    ['OLYMPUS CORPORATION', 'E-P7'],
  ])('imports complete profiles from %s / %s', async (make, model) => {
    jest.mocked(getPhoto).mockResolvedValueOnce({
      id: 'other-camera', make, model, url: 'https://photos.example/profile.jpg',
    } as Awaited<ReturnType<typeof getPhoto>>);
    const recipe = {
      version: 1 as const, kind: 'color' as const, colors: Array(12).fill(0),
      whiteBalance: { mode: 1, amber: 2, green: -3 },
      tone: { shadow: -4, mid: 0, highlight: 4 },
      shading: 0, sharpness: 0, contrast: 0,
    };
    jest.mocked(getOmRecipeFromImage).mockReturnValueOnce({
      isOmCamera: true, recipe,
    });
    expect(await importOmRecipeAction('other-camera')).toEqual({
      photoId: 'other-camera', status: 'imported',
    });
    expect(storeOmRecipe).toHaveBeenCalledWith(
      'other-camera', 'https://photos.example/profile.jpg', recipe,
    );
  });

  it('marks absent/incomplete results once, including hidden admin photos', async () => {
    expect(await importOmRecipeAction('penphoto')).toEqual({
      photoId: 'penphoto', status: 'absent',
    });
    expect(getPhoto).toHaveBeenCalledWith('penphoto', true);
    expect(fetchUrlWithByteLimit).toHaveBeenCalledTimes(1);
    expect(storeOmRecipe).toHaveBeenCalledWith(
      'penphoto', 'https://photos.example/pen.jpg', undefined,
    );
    expect(revalidatePhoto).toHaveBeenCalledWith('penphoto');
  });

  it('leaves failed downloads retryable', async () => {
    jest.mocked(fetchUrlWithByteLimit).mockRejectedValueOnce(new Error('Offline'));
    expect(await importOmRecipeAction('penphoto')).toMatchObject({
      status: 'failed', message: 'Offline',
    });
    expect(storeOmRecipe).not.toHaveBeenCalled();
    expect(revalidatePhoto).not.toHaveBeenCalled();
    expect((await importOmRecipeAction('penphoto')).status).toBe('absent');
    expect(storeOmRecipe).toHaveBeenCalledTimes(1);
  });

  it('reports parse and write failures instead of counting success', async () => {
    jest.mocked(getOmRecipeFromImage).mockImplementationOnce(() => {
      throw new Error('Invalid image');
    });
    expect((await importOmRecipeAction('penphoto')).status).toBe('failed');
    expect(storeOmRecipe).not.toHaveBeenCalled();
    jest.mocked(storeOmRecipe).mockRejectedValueOnce(new Error('Photo changed'));
    expect(await importOmRecipeAction('penphoto')).toMatchObject({
      status: 'failed', message: 'Photo changed',
    });
  });

  it('does not fetch or change another camera type', async () => {
    jest.mocked(getPhoto).mockResolvedValueOnce({
      make: 'FUJIFILM', model: 'X100VI',
    } as Awaited<ReturnType<typeof getPhoto>>);
    expect((await importOmRecipeAction('not-a-pen')).status).toBe('failed');
    expect(fetchUrlWithByteLimit).not.toHaveBeenCalled();
    expect(storeOmRecipe).not.toHaveBeenCalled();
  });

  it('requires authentication before reading an original or writing data', async () => {
    jest.mocked(runAuthenticatedAdminServerAction).mockRejectedValueOnce(
      new Error('Unauthorized'),
    );
    await expect(importOmRecipeAction('penphoto')).rejects.toThrow('Unauthorized');
    expect(getPhoto).not.toHaveBeenCalled();
    expect(fetchUrlWithByteLimit).not.toHaveBeenCalled();
  });
});
