import { parameterize } from '@/utility/string';
import {
  addPhotoAlbumId,
  clearPhotoAlbumIds,
  getAlbumsWithMeta,
  insertAlbum,
} from './query';

const createAlbumsAndGetIds = async (titles: string[]) => {
  const albums = await getAlbumsWithMeta();
  return Promise.all(titles.map(async title => {
    const album = albums.find(({ album }) => album.title === title);
    if (album) {
      return album.album.id;
    } else {
      const albumInsert = { title, slug: parameterize(title) };
      return insertAlbum(albumInsert);
    }
  }));
};

export const addAlbumTitlesToPhoto = async (
  albumTitles: string[],
  photoId: string,
  shouldClearPhotoAlbumIds = true,
) => {
  const albumIds = await createAlbumsAndGetIds(albumTitles);
  if (shouldClearPhotoAlbumIds) { await clearPhotoAlbumIds(photoId); }
  await Promise.all(albumIds.map(albumId => addPhotoAlbumId(photoId, albumId)));
};
