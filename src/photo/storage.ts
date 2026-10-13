import {
  copyFile,
  deleteFile,
  generateRandomFileNameForPhoto,
  getExtensionFromStorageUrl,
  moveFile,
  putFile,
} from '@/platforms/storage';
import {
  HAS_CLOUDFLARE_R2_WEB_BUCKET,
  cloudflareR2Put,
  isUrlFromCloudflareR2Web,
} from '@/platforms/storage/cloudflare-r2';
import { removeGpsData } from './server';

export const convertUploadToPhoto = async ({
  urlOrigin,
  fileBytes,
  shouldStripGpsData,
  shouldDeleteOrigin = true,
} : {
  urlOrigin: string
  fileBytes?: ArrayBuffer
  shouldStripGpsData?: boolean
  shouldDeleteOrigin?: boolean
}) => {
  const fileName = generateRandomFileNameForPhoto();
  const fileExtension = getExtensionFromStorageUrl(urlOrigin);
  const photoPath = `${fileName}.${fileExtension || 'jpg'}`;
  const isWebOrigin = isUrlFromCloudflareR2Web(urlOrigin);

  // Guard against a missing origin object (e.g. an upload that never finished
  // or was deleted): a missing source otherwise surfaces as an uncaught deep
  // throw and the admin only sees the production RSC digest crash.
  if (!fileBytes) {
    const head = await fetch(urlOrigin, { method: 'HEAD' });
    if (!head.ok) {
      throw new Error(
        'No se pudo procesar la imagen: el archivo de origen no está ' +
        `disponible (HTTP ${head.status}). Puede que la subida no se haya ` +
        'completado; intentá subirla de nuevo.',
      );
    }
  }

  try {
    if (shouldStripGpsData) {
      const fileWithoutGps = await removeGpsData(
        fileBytes ?? await fetch(urlOrigin, { cache: 'no-store' })
          .then(res => res.arrayBuffer()),
      );
      // Keep a GPS-stripped low-res image in the public web bucket
      // (`parker-web`) so it resolves to a CDN URL; high-res/private stays
      // on the default putFile path.
      const put = isWebOrigin && HAS_CLOUDFLARE_R2_WEB_BUCKET
        ? cloudflareR2Put(fileWithoutGps, photoPath, 'web')
        : putFile(fileWithoutGps, photoPath);
      return put.then(async url => {
        if (url && shouldDeleteOrigin) { await deleteFile(urlOrigin); }
        return url;
      });
    } else {
      return shouldDeleteOrigin
        ? moveFile(urlOrigin, photoPath)
        : copyFile(urlOrigin, photoPath);
    }
  } catch (e) {
    throw new Error(
      `No se pudo procesar la imagen: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
  }
};
