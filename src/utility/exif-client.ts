import piexif from 'piexifjs';

interface ImageConversionOptions {
  maxSize: number
  quality: number
}

// Read a Blob/File as ArrayBuffer
const readAsArrayBuffer = (blob: Blob): Promise<ArrayBuffer> =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as ArrayBuffer);
    fr.onerror = () => rej(fr.error ?? new Error('FileReader error'));
    fr.readAsArrayBuffer(blob);
  });

// Read a Blob/File as DataURL
const readAsDataURL = (blob: Blob): Promise<string> =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = () => rej(fr.error ?? new Error('FileReader error'));
    fr.readAsDataURL(blob);
  });

// Convert DataURL string -> Blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const [header, b64] = dataURL.split(',');
  const mimeMatch = header.match(/data:([^;]+);base64/);
  if (!mimeMatch) throw new Error('Invalid data URL');
  const mime = mimeMatch[1];
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], { type: mime });
};

// Extract raw EXIF (TIFF) bytes from a PNG eXIf chunk.
// Returns Uint8Array or null if no EXIF found.
const extractExifFromPNG = (
  arrayBuffer: ArrayBuffer,
): Uint8Array | null => {
  const u8 = new Uint8Array(arrayBuffer);
  // PNG signature
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) {
    if (u8[i] !== sig[i]) throw new Error('Not a PNG');
  }

  let p = 8; // after signature
  while (p + 8 <= u8.length) {
    const len =
      (u8[p] << 24) | (u8[p + 1] << 16) | (u8[p + 2] << 8) | u8[p + 3];
    const type = String.fromCharCode(
      u8[p + 4],
      u8[p + 5],
      u8[p + 6],
      u8[p + 7],
    );
    const dataStart = p + 8;
    const dataEnd = dataStart + len;
    const crcEnd = dataEnd + 4;
    if (crcEnd > u8.length) break;

    if (type === 'eXIf') {
      // Payload is the pure TIFF bytes (no "Exif\0\0" header)
      return u8.slice(dataStart, dataEnd);
    }
    if (type === 'IEND') break;
    p = crcEnd;
  }
  return null;
};

// Extract raw EXIF (TIFF) bytes from a JPEG file.
// Returns Uint8Array or null if no EXIF found.
const extractExifFromJpeg = (
  arrayBuffer: ArrayBuffer,
): Uint8Array | null => {
  const u8 = new Uint8Array(arrayBuffer);
  
  // Check JPEG signature (SOI marker)
  if (u8[0] !== 0xFF || u8[1] !== 0xD8) {
    throw new Error('Not a JPEG');
  }

  let p = 2; // after SOI marker
  while (p + 4 <= u8.length) {
    // Check for marker
    if (u8[p] !== 0xFF) break;
    
    const marker = u8[p + 1];
    const length = (u8[p + 2] << 8) | u8[p + 3];
    const dataStart = p + 4;
    // length includes the 2 bytes for length itself
    const dataEnd = dataStart + length - 2;
    
    if (dataEnd > u8.length) break;

    // APP1 marker contains EXIF data
    if (marker === 0xE1) {
      // Check for EXIF header "Exif\0\0"
      if (dataEnd >= dataStart + 6) {
        const exifHeader = String.fromCharCode(
          u8[dataStart], u8[dataStart + 1], u8[dataStart + 2], 
          u8[dataStart + 3], u8[dataStart + 4], u8[dataStart + 5],
        );
        if (exifHeader === 'Exif\0\0') {
          // Return the TIFF data (skip the "Exif\0\0" header)
          return u8.slice(dataStart + 6, dataEnd);
        }
      }
    }

    p = dataEnd;
  }
  
  return null;
};

// Draw onto a canvas, resize, and encode to JPEG Blob
const resizeToJpegBlob = async (
  source: ImageBitmap | HTMLImageElement,
  { maxSize, quality }: ImageConversionOptions,
): Promise<Blob> => {
  let w = source.width;
  let h = source.height;

  if (Math.max(w, h) > maxSize) {
    const scale = maxSize / Math.max(w, h);
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
  if (!ctx) throw new Error('2D context unavailable');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source as CanvasImageSource, 0, 0, w, h);

  const blob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b as Blob), 'image/jpeg', quality),
  );
  if (!blob) throw new Error('canvas.toBlob failed');
  return blob;
};

// Insert raw EXIF bytes into a JPEG Blob using piexifjs.
// Also normalizes Orientation -> 1 (since pixels are already upright).
const insertExifIntoJpegBlob = async (
  jpegBlob: Blob,
  rawExifUint8: Uint8Array | null,
): Promise<Blob> => {
  const jpegDataURL = await readAsDataURL(jpegBlob);

  let withExifDataURL = jpegDataURL;

  if (rawExifUint8 && rawExifUint8.length > 0) {
    // Build the EXIF binary string ("Exif\0\0" + TIFF bytes)
    const exifHeader = 'Exif\0\0';
    let exifBody = '';
    for (let i = 0; i < rawExifUint8.length; i++) {
      exifBody += String.fromCharCode(rawExifUint8[i]);
    }
    const exifBinaryString = exifHeader + exifBody;
    withExifDataURL = piexif.insert(exifBinaryString, jpegDataURL);
  }

  // Normalize Orientation to 1
  const exifObj = piexif.load(withExifDataURL);
  if (exifObj?.['0th']) {
    exifObj['0th'][piexif.ImageIFD.Orientation] = 1;
  }
  const normalizedDataURL = piexif
    .insert(piexif.dump(exifObj), withExifDataURL);

  return dataURLtoBlob(normalizedDataURL);
};

/**
 * Main: PNG File -> JPEG Blob with EXIF preserved, resized via canvas.toBlob()
 * - Honors EXIF orientation at decode using:
 * createImageBitmap(..., { imageOrientation: 'from-image' })
 * - Sets Orientation=1 in the written EXIF so viewers don't rotate again
 */
export const pngToJpegWithExif = async (
  file: File,
  options: ImageConversionOptions,
): Promise<Blob> => {
  // Extract EXIF from PNG (if present)
  const ab = await readAsArrayBuffer(file);
  const rawExif = extractExifFromPNG(ab); // Uint8Array | null

  // Decode the PNG for drawing
  const img = document.createElement('img');
  img.crossOrigin = 'anonymous'; // for remote URLs with CORS, harmless for File
  img.src = URL.createObjectURL(file);
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error('Image load failed'));
  });

  // Prefer ImageBitmap with orientation applied by decoder
  const bitmap = await createImageBitmap(
    img,
    { imageOrientation: 'from-image' },
  );

  // Resize on canvas -> JPEG Blob
  const jpegBlob = await resizeToJpegBlob(bitmap, options);

  // Insert EXIF (and normalize Orientation)
  const outBlob = await insertExifIntoJpegBlob(jpegBlob, rawExif);

  // cleanup
  URL.revokeObjectURL(img.src);
  bitmap.close?.();

  return outBlob;
};

/**
 * Main: JPEG File -> JPEG Blob with EXIF preserved, resized via canvas.toBlob()
 * - Honors EXIF orientation at decode using:
 * createImageBitmap(..., { imageOrientation: 'from-image' })
 * - Sets Orientation=1 in the written EXIF so viewers don't rotate again
 */
export const jpgToJpegWithExif = async (
  file: File,
  options: ImageConversionOptions,
): Promise<Blob> => {
  // Extract EXIF from JPEG (if present)
  const ab = await readAsArrayBuffer(file);
  const rawExif = extractExifFromJpeg(ab); // Uint8Array | null

  // Decode the JPEG for drawing
  const img = document.createElement('img');
  img.crossOrigin = 'anonymous'; // for remote URLs with CORS, harmless for File
  img.src = URL.createObjectURL(file);
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error('Image load failed'));
  });

  // Prefer ImageBitmap with orientation applied by decoder
  const bitmap = await createImageBitmap(
    img,
    { imageOrientation: 'from-image' },
  );

  // Resize on canvas -> JPEG Blob
  const jpegBlob = await resizeToJpegBlob(bitmap, options);

  // Insert EXIF (and normalize Orientation)
  const outBlob = await insertExifIntoJpegBlob(jpegBlob, rawExif);

  // cleanup
  URL.revokeObjectURL(img.src);
  bitmap.close?.();

  return outBlob;
};
