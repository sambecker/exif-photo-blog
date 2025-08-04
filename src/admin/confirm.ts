import { Photo } from '@/photo';

export const syncPhotoConfirmText = (
  photo: Photo,
  hasAiTextGeneration: boolean,
  onlySyncColorData?: boolean,
) => {
  const confirmText = ['Sync'];
  if (photo.title) { confirmText.push(`"${photo.title}"`); }
  if (onlySyncColorData) {
    confirmText.push('color data?');
  } else {
    confirmText.push('data from original image file?');
    if (hasAiTextGeneration) { confirmText.push(
      'AI text will be generated for undefined fields.'); }
  }
  confirmText.push('This action cannot be undone.');
  return confirmText.join(' ');
};
