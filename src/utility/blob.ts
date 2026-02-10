// Read a Blob/File as ArrayBuffer
export const readAsArrayBuffer = (blob: Blob): Promise<ArrayBuffer> =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as ArrayBuffer);
    fr.onerror = () => rej(fr.error ?? new Error('FileReader error'));
    fr.readAsArrayBuffer(blob);
  });

// Read a Blob/File as DataURL
export const readAsDataURL = (blob: Blob): Promise<string> =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = () => rej(fr.error ?? new Error('FileReader error'));
    fr.readAsDataURL(blob);
  });

// Convert DataURL string -> Blob
export const dataURLtoBlob = (dataURL: string): Blob => {
  const [header, b64] = dataURL.split(',');
  const mimeMatch = header.match(/data:([^;]+);base64/);
  if (!mimeMatch) throw new Error('Invalid data URL');
  const mime = mimeMatch[1];
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], { type: mime });
};
