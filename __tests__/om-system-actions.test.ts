/* eslint-disable @stylistic/max-len */
import { importPenRecipeAction } from '@/platforms/om-system/actions';
import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { getPhoto } from '@/photo/query';
import { revalidatePhoto } from '@/photo/cache';
import { fetchUrlWithByteLimit } from '@/utility/fetch';
import { getOmRecipeFromImage } from '@/platforms/om-system/server';
import { storePenRecipe } from '@/platforms/om-system/query';

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
jest.mock('../src/platforms/om-system/query', () => ({ storePenRecipe: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getPhoto).mockResolvedValue({
    id: 'penphoto', make: 'OM Digital Solutions', model: 'PEN',
    url: 'https://photos.example/pen.jpg',
  } as Awaited<ReturnType<typeof getPhoto>>);
  jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(new ArrayBuffer(8));
  jest.mocked(getOmRecipeFromImage).mockReturnValue({
    isPen: true, recipe: undefined,
  });
  jest.mocked(storePenRecipe).mockResolvedValue(undefined);
});

describe('PEN recipe import', () => {
  it('marks absent/incomplete results once, including hidden admin photos', async () => {
    expect(await importPenRecipeAction('penphoto')).toEqual({
      photoId: 'penphoto', status: 'absent',
    });
    expect(getPhoto).toHaveBeenCalledWith('penphoto', true);
    expect(fetchUrlWithByteLimit).toHaveBeenCalledTimes(1);
    expect(storePenRecipe).toHaveBeenCalledWith(
      'penphoto', 'https://photos.example/pen.jpg', undefined,
    );
    expect(revalidatePhoto).toHaveBeenCalledWith('penphoto');
  });

  it('leaves failed downloads retryable', async () => {
    jest.mocked(fetchUrlWithByteLimit).mockRejectedValueOnce(new Error('Offline'));
    expect(await importPenRecipeAction('penphoto')).toMatchObject({
      status: 'failed', message: 'Offline',
    });
    expect(storePenRecipe).not.toHaveBeenCalled();
    expect(revalidatePhoto).not.toHaveBeenCalled();
    expect((await importPenRecipeAction('penphoto')).status).toBe('absent');
    expect(storePenRecipe).toHaveBeenCalledTimes(1);
  });

  it('reports parse and write failures instead of counting success', async () => {
    jest.mocked(getOmRecipeFromImage).mockImplementationOnce(() => {
      throw new Error('Invalid image');
    });
    expect((await importPenRecipeAction('penphoto')).status).toBe('failed');
    expect(storePenRecipe).not.toHaveBeenCalled();
    jest.mocked(storePenRecipe).mockRejectedValueOnce(new Error('Photo changed'));
    expect(await importPenRecipeAction('penphoto')).toMatchObject({
      status: 'failed', message: 'Photo changed',
    });
  });

  it('does not fetch or change another camera type', async () => {
    jest.mocked(getPhoto).mockResolvedValueOnce({
      make: 'FUJIFILM', model: 'X100VI',
    } as Awaited<ReturnType<typeof getPhoto>>);
    expect((await importPenRecipeAction('not-a-pen')).status).toBe('failed');
    expect(fetchUrlWithByteLimit).not.toHaveBeenCalled();
    expect(storePenRecipe).not.toHaveBeenCalled();
  });

  it('requires authentication before reading an original or writing data', async () => {
    jest.mocked(runAuthenticatedAdminServerAction).mockRejectedValueOnce(
      new Error('Unauthorized'),
    );
    await expect(importPenRecipeAction('penphoto')).rejects.toThrow('Unauthorized');
    expect(getPhoto).not.toHaveBeenCalled();
    expect(fetchUrlWithByteLimit).not.toHaveBeenCalled();
  });
});
