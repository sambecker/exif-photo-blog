import { capitalizeWords, parameterize } from '@/utility/string';
import {
  addPhotoAlbumId,
  clearPhotoAlbumIds,
  getAlbumsWithMeta,
  insertAlbum,
} from './query';
import { deletePhotoTagGlobally, getPhotos } from '@/photo/query';

export const createAlbumsAndGetIds = async (titles: string[]) => {
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

export const upgradeTagToAlbum = async (tag: string) => {
  const title = capitalizeWords(tag.replaceAll('-', ' '));
  const slug = tag;
  const photos = await getPhotos({ tag });
  if (photos.length > 0) {
    const albumId = await insertAlbum({ title, slug });
    if (albumId) {
      return Promise
        .all(photos.map(photo => addPhotoAlbumId(photo.id, albumId)))
        .then(() => deletePhotoTagGlobally(tag))
        .then(() => albumId);
    }
    return Promise.reject(
      new Error(`Failed to upgrade tag "${tag}" to album`),
    );
  }
};
