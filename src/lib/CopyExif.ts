export async function CopyExif(
  src: Blob,
  dest: Blob,
  type = 'image/jpeg',
) {
  const exif = await retrieveExif(src);
  return new Blob([dest.slice(0, 2), exif, dest.slice(2)], { type });
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
