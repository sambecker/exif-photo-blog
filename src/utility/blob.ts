export const blobToImage = (blob: Blob): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject('Error reading image');

    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject('Error reading image');
    reader.onload = e => {
      const result = (e.currentTarget as any).result as string;
      image.src = result;
    };

    reader.readAsDataURL(blob);
  });
