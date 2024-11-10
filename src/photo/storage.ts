import {
  copyFile,
  deleteFile,
  generateRandomFileNameForPhoto,
  getExtensionFromStorageUrl,
  moveFile,
  putFile,
} from "@/services/storage";
import {addOverlayImageBuffer, removeGpsData} from "./server";

export const convertUploadToPhoto = async ({
  urlOrigin,
  fileBytes,
  shouldStripGpsData,
  watermarkFileBytes,
  shouldDeleteOrigin = true,
}: {
  urlOrigin: string;
  fileBytes?: ArrayBuffer;
  shouldStripGpsData?: boolean;
  watermarkFileBytes?: ArrayBuffer | null;
  shouldDeleteOrigin?: boolean;
}) => {
  const fileName = generateRandomFileNameForPhoto();
  const fileExtension = getExtensionFromStorageUrl(urlOrigin);
  const photoPath = `${fileName}.${fileExtension || "jpg"}`;
  const photoWatermarkPath = `${fileName}-watermark.${fileExtension || "jpg"}`;
  var photoUrl = null;

  if (!fileBytes) {
    fileBytes = await fetch(urlOrigin, {cache: "no-store"}).then(res =>
      res.arrayBuffer()
    );
  }

  if (shouldStripGpsData && fileBytes) {
    const fileWithoutGps = await removeGpsData(fileBytes);
    if (watermarkFileBytes) {
      // we want to compute the image with the watermark and then store the image.
      const watermarkedPhoto = await addOverlayImageBuffer(
        new Uint8Array(fileWithoutGps),
        watermarkFileBytes
      );
      await putFile(watermarkedPhoto, photoWatermarkPath);
    }
    photoUrl = putFile(fileWithoutGps, photoPath).then(async url => {
      if (url && shouldDeleteOrigin) {
        await deleteFile(urlOrigin);
      }
      return url;
    });
  } else {
    photoUrl = shouldDeleteOrigin
      ? moveFile(urlOrigin, photoPath)
      : copyFile(urlOrigin, photoPath);
  }

  if (watermarkFileBytes && watermarkFileBytes?.byteLength && fileBytes) {
    // we want to compute the image with the watermark and then store the image.
    const watermarkedPhoto = await addOverlayImageBuffer(
      fileBytes,
      watermarkFileBytes
    );
    return putFile(watermarkedPhoto, photoWatermarkPath);
  }

  return photoUrl;
};
