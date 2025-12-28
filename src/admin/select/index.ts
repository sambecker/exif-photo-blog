export const DATA_KEY_PHOTO_GRID = 'data-photo-grid';

export const getPhotoGridElements = () =>
  document.querySelectorAll(`[${DATA_KEY_PHOTO_GRID}=true]`);
