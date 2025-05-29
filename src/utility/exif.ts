import { OrientationTypes, type ExifData } from 'ts-exif-parser';

const OFFSET_REGEX = /[+-]\d\d:\d\d/;

export const getOffsetFromExif = (data: ExifData) =>
  Object.values(data.tags as any)
    .find((value: any) =>
      typeof value === 'string' &&
      OFFSET_REGEX.test(value),
    ) as string | undefined;

export const getAspectRatioFromExif = (data: ExifData): number => {
  // Using '||' operator to handle `Orientation` unexpectedly being '0'
  const orientation = data.tags?.Orientation || OrientationTypes.TOP_LEFT;

  const width = data.imageSize?.width ?? 3.0;
  const height = data.imageSize?.height ?? 2.0;

  switch (orientation) {
  case OrientationTypes.TOP_LEFT:
  case OrientationTypes.TOP_RIGHT:
  case OrientationTypes.BOTTOM_RIGHT:
  case OrientationTypes.BOTTOM_LEFT:
  case OrientationTypes.LEFT_TOP:
  case OrientationTypes.RIGHT_BOTTOM:
    return width / height;
  case OrientationTypes.RIGHT_TOP:
  case OrientationTypes.LEFT_BOTTOM:
    return height / width;
  }
};

export const convertApertureValueToFNumber = (
  apertureValue?: string,
): string | undefined => {
  if (apertureValue) {
    const aperture = parseInt(apertureValue);
    if (aperture <= 10) {
      switch (aperture) {
      case 0: return '1';
      case 1: return '1.4';
      case 2: return '2';
      case 3: return '2.8';
      case 4: return '4';
      case 5: return '5.6';
      case 6: return '8';
      case 7: return '11';
      case 8: return '16';
      case 9: return '22';
      case 10: return '32';
      }
    } else {
      const value = Math.round(Math.pow(2, aperture / 2.0) * 10) / 10;
      return Number.isInteger(value)
        ? value.toFixed(0)
        : value.toFixed(1);
    }
  } else {
    return undefined;
  }
};

const SOS = 0xffda;
const APP1 = 0xffe1;
const EXIF = 0x45786966;

const retrieveExif = (blob: Blob): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', e => {
      const buffer = e.target!.result as ArrayBuffer;
      const view = new DataView(buffer);
      let offset = 0;
      if (view.getUint16(offset) !== 0xffd8)
        return reject('not a valid jpeg');
      offset += 2;

      while (true) {
        const marker = view.getUint16(offset);
        if (marker === SOS) break;
        const size = view.getUint16(offset + 2);
        if (marker === APP1 && view.getUint32(offset + 4) === EXIF)
          return resolve(blob.slice(offset, offset + 2 + size));
        offset += 2 + size;
      }
      return resolve(new Blob());
    });
    reader.readAsArrayBuffer(blob);
  });

export const CopyExif = async (
  src: Blob,
  dest: Blob,
  type = 'image/jpeg',
) => {
  const exif = await retrieveExif(src);
  return new Blob([dest.slice(0, 2), exif, dest.slice(2)], { type });
};

export const getOrientation = (file: File): Promise<number> =>
  file.arrayBuffer().then(buffer => {
    const view = new DataView(buffer);

    if (view.getUint16(0, false) !== 0xFFD8) {
      return -2;
    } else {
      const length = view.byteLength;
      let offset = 2;
      while (offset < length)  {
        if (view.getUint16(offset + 2, false) <= 8) return -1;
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker === 0xFFE1) {
          if (view.getUint32(offset += 2, false) !== 0x45786966) {
            return -1;
          } else {
            const little = view.getUint16(offset += 6, false) === 0x4949;
            offset += view.getUint32(offset + 4, little);
            const tags = view.getUint16(offset, little);
            offset += 2;
            for (let i = 0; i < tags; i++) {
              if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                return view.getUint16(offset + (i * 12) + 8, little);
              }
            }
          }
        } else if ((marker & 0xFF00) !== 0xFF00) {
          break;
        } else { 
          offset += view.getUint16(offset, false);
        }
      }

      return -1;
    };
  });
