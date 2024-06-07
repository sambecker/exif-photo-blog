export const b64toBlob = (
  data: string,
  type: string = 'image/jpeg',
): Blob => {
  const byteString = atob(data.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type });
};
