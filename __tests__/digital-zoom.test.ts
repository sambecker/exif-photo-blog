import sharp from 'sharp';
import piexif from 'piexifjs';
import { syncPhotoAction } from '@/photo/actions';
import { getPhoto, updatePhoto } from '@/photo/query';
import { parsePhotoFromDb } from '@/photo';
import { fetchUrlWithByteLimit } from '@/utility/fetch';
import { convertPhotoToFormData, convertFormDataToPhotoDbInsert }
  from '@/photo/form';
import { extractImageDataFromBlobPath } from '@/photo/server';

jest.mock('../src/auth/server', () => ({
  runAuthenticatedAdminServerAction: (callback: () => unknown) => callback(),
}));
jest.mock('../src/app/config', () => ({
  BLUR_ENABLED: false, AI_CONTENT_GENERATION_ENABLED: false,
  GEO_PRIVACY_ENABLED: false, AI_TEXT_AUTO_GENERATED_FIELDS: [],
  getBaseUrl: () => 'https://photos.example',
}));
jest.mock('../src/photo/query', () => ({
  getPhoto: jest.fn(), updatePhoto: jest.fn().mockResolvedValue(undefined),
  getUniqueTags: jest.fn().mockResolvedValue([]),
}));
jest.mock('../src/photo/cache', () => ({ revalidatePhoto: jest.fn() }));
jest.mock('../src/cache', () => ({ revalidateAllKeysAndPaths: jest.fn() }));
jest.mock('../src/utility/fetch', () => ({ fetchUrlWithByteLimit: jest.fn() }));
jest.mock('../src/photo/color/server', () => ({
  getColorFieldsForPhotoForm: jest.fn(),
}));
jest.mock('../src/photo/ai/server', () => ({
  generateAiImageQueries: jest.fn().mockResolvedValue({}),
}));
jest.mock('../src/photo/update/server', () => ({
  shouldBackfillPhotoStorage: jest.fn().mockResolvedValue(false),
}));
jest.mock('../src/platforms/storage', () => ({
  getFileNamePartsFromStorageUrl: () => ({ fileExtension: 'jpg' }),
}));
jest.mock('../src/platforms/openai', () => ({}));
jest.mock('@ai-sdk/rsc', () => ({}));
jest.mock('next/server', () => ({ after: jest.fn() }));

let digitalZoomJpeg: Buffer;
beforeAll(async () => {
  const image = await sharp({ create: {
    width: 8, height: 6, channels: 3, background: '#444444',
  } }).jpeg().toBuffer();
  const exif = piexif.dump({
    '0th': {
      [piexif.ImageIFD.Make]: 'Canon',
      [piexif.ImageIFD.Model]: 'EOS R6',
    },
    Exif: {
      [piexif.ExifIFD.FocalLength]: [17, 1],
      [piexif.ExifIFD.DigitalZoomRatio]: [2, 1],
    },
  });
  digitalZoomJpeg = Buffer.from(
    piexif.insert(exif, image.toString('binary')), 'binary',
  );
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getPhoto).mockResolvedValue(parsePhotoFromDb({
    id: 'zoomtest', url: 'https://photos.example/zoom.jpg', extension: 'jpg',
    make: 'Canon', model: 'EOS R6', aspectRatio: 4 / 3, tags: [],
    takenAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    takenAtNaive: '2026-11-01 12:00:00',
  }));
  jest.mocked(fetchUrlWithByteLimit).mockResolvedValue(
    Uint8Array.from(digitalZoomJpeg).buffer,
  );
});

it.each(['auto', 'only-missing', 'overwrite'] as const)(
  'recovers standard EXIF digital zoom during %s Sync', async syncMode => {
    await syncPhotoAction('zoomtest', { syncMode });
    const [saved] = jest.mocked(updatePhoto).mock.calls[0];
    expect(saved).toMatchObject({ focalLength: 17, digitalZoomRatio: 2 });
    const form = convertPhotoToFormData(parsePhotoFromDb({
      ...saved, tags: [], createdAt: new Date(), updatedAt: new Date(),
    }));
    form.title = 'Edited title';
    expect(convertFormDataToPhotoDbInsert(form)).toMatchObject({
      title: 'Edited title', digitalZoomRatio: 2,
    });
  },
);

it('reserves a stable photo ID before submitting Add', async () => {
  const { formDataFromExif } = await extractImageDataFromBlobPath(
    'https://photos.example/upload.jpg', {
      includeInitialPhotoFields: true, updateColorFields: false,
    },
  );
  expect(formDataFromExif?.id).toMatch(/^[a-zA-Z0-9]{8}$/);
  const id = formDataFromExif?.id;
  expect(convertFormDataToPhotoDbInsert({ ...formDataFromExif }).id).toBe(id);
  expect(convertFormDataToPhotoDbInsert({ ...formDataFromExif }).id).toBe(id);
});

it.each(['', '0', '-2', 'NaN', 'Infinity', '2x'])(
  'does not save invalid digital zoom %s', digitalZoomRatio => {
    expect(convertFormDataToPhotoDbInsert({ digitalZoomRatio })
      .digitalZoomRatio).toBeUndefined();
  },
);

it('keeps fractional digital zoom', () => {
  expect(convertFormDataToPhotoDbInsert({ digitalZoomRatio: '1.4' })
    .digitalZoomRatio).toBe(1.4);
});
