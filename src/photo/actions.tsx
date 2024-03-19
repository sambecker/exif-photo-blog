'use server';

import {
  sqlDeletePhoto,
  sqlInsertPhoto,
  sqlDeletePhotoTagGlobally,
  sqlUpdatePhoto,
  sqlRenamePhotoTagGlobally,
  getPhoto,
  getPhotos,
} from '@/services/vercel-postgres';
import {
  PhotoFormData,
  convertFormDataToPhotoDbInsert,
  convertPhotoToFormData,
} from './form';
import { redirect } from 'next/navigation';
import {
  convertUploadToPhoto,
  deleteStorageUrl,
} from '@/services/storage';
import {
  revalidateAdminPaths,
  revalidateAllKeysAndPaths,
  revalidatePhoto,
  revalidatePhotosKey,
  revalidateTagsKey,
} from '@/photo/cache';
import {
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ROOT,
  pathForPhoto,
} from '@/site/paths';
import { extractExifDataFromBlobPath } from './server';
import { TAG_FAVS, isTagFavs } from '@/tag';
import { TbPhoto } from 'react-icons/tb';
import PhotoTiny from './PhotoTiny';
import { formatDate } from '@/utility/date';
import { convertPhotoToPhotoDbInsert, titleForPhoto } from '.';
import { safelyRunServerAdminAction } from '@/auth';

export async function createPhotoAction(formData: FormData) {
  return safelyRunServerAdminAction(async () => {
    const photo = convertFormDataToPhotoDbInsert(formData, true);

    const updatedUrl = await convertUploadToPhoto(photo.url, photo.id);
  
    if (updatedUrl) { photo.url = updatedUrl; }
  
    await sqlInsertPhoto(photo);
  
    revalidateAllKeysAndPaths();
  
    redirect(PATH_ADMIN_PHOTOS);
  });
}

export async function updatePhotoAction(formData: FormData) {
  return safelyRunServerAdminAction(async () => {
    const photo = convertFormDataToPhotoDbInsert(formData);

    await sqlUpdatePhoto(photo);

    revalidatePhoto(photo.id);

    redirect(PATH_ADMIN_PHOTOS);
  });
}

export async function toggleFavoritePhotoAction(
  photoId: string,
  shouldRedirect?: boolean,
) {
  return safelyRunServerAdminAction(async () => {
    const photo = await getPhoto(photoId);
    if (photo) {
      const { tags } = photo;
      photo.tags = tags.some(tag => tag === TAG_FAVS)
        ? tags.filter(tag => !isTagFavs(tag))
        : [...tags, TAG_FAVS];
      await sqlUpdatePhoto(convertPhotoToPhotoDbInsert(photo));
      revalidateAllKeysAndPaths();
      if (shouldRedirect) {
        redirect(pathForPhoto(photoId));
      }
    }
  });
}

export async function deletePhotoAction(
  photoId: string,
  photoUrl: string,
  shouldRedirect?: boolean,
) {
  return safelyRunServerAdminAction(async () => {
    await sqlDeletePhoto(photoId).then(() => deleteStorageUrl(photoUrl));
    revalidateAllKeysAndPaths();
    if (shouldRedirect) {
      redirect(PATH_ROOT);
    }
  });
};

export async function deletePhotoFormAction(formData: FormData) {
  return safelyRunServerAdminAction(async () =>
    deletePhotoAction(
      formData.get('id') as string,
      formData.get('url') as string,
    )
  );
};

export async function deletePhotoTagGloballyAction(formData: FormData) {
  return safelyRunServerAdminAction(async () => {
    const tag = formData.get('tag') as string;

    await sqlDeletePhotoTagGlobally(tag);

    revalidatePhotosKey();
    revalidateAdminPaths();
  });
}

export async function renamePhotoTagGloballyAction(formData: FormData) {
  return safelyRunServerAdminAction(async () => {
    const tag = formData.get('tag') as string;
    const updatedTag = formData.get('updatedTag') as string;

    if (tag && updatedTag && tag !== updatedTag) {
      await sqlRenamePhotoTagGlobally(tag, updatedTag);
      revalidatePhotosKey();
      revalidateTagsKey();
      redirect(PATH_ADMIN_TAGS);
    }
  });
}

export async function deleteBlobPhotoAction(formData: FormData) {
  return safelyRunServerAdminAction(async () => {
    await deleteStorageUrl(formData.get('url') as string);

    revalidateAdminPaths();

    if (formData.get('redirectToPhotos') === 'true') {
      redirect(PATH_ADMIN_PHOTOS);
    }
  });
}

export async function getExifDataAction(
  photoFormPrevious: Partial<PhotoFormData>,
): Promise<Partial<PhotoFormData>> {
  return safelyRunServerAdminAction(async () => {
    const { url } = photoFormPrevious;
    if (url) {
      const { photoFormExif } = await extractExifDataFromBlobPath(url);
      if (photoFormExif) {
        return photoFormExif;
      }
    }
    return {};
  });
}

export async function syncPhotoExifDataAction(formData: FormData) {
  return safelyRunServerAdminAction(async () => {
    const photoId = formData.get('id') as string;
    if (photoId) {
      const photo = await getPhoto(photoId);
      if (photo) {
        const { photoFormExif } = await extractExifDataFromBlobPath(photo.url);
        if (photoFormExif) {
          const photoFormDbInsert = convertFormDataToPhotoDbInsert({
            ...convertPhotoToFormData(photo),
            ...photoFormExif,
          });
          await sqlUpdatePhoto(photoFormDbInsert);
          revalidatePhotosKey();
        }
      }
    }
  });
}

export async function syncCacheAction() {
  return safelyRunServerAdminAction(revalidateAllKeysAndPaths);
}

export async function getPhotoItemsAction(query: string) {
  const photos = (await getPhotos({ title: query, limit: 10 }))
    .filter(({ title }) => Boolean(title));
  return photos.length > 0
    ? [{
      heading: 'Photos',
      accessory: <TbPhoto size={14} />,
      items: photos.map(photo => ({
        accessory: <PhotoTiny photo={photo} />,
        label: titleForPhoto(photo),
        annotation: <>
          <span className="hidden sm:inline-block">
            {formatDate(photo.takenAt)}
          </span>
          <span className="inline-block sm:hidden">
            {formatDate(photo.takenAt, true)}
          </span>
        </>,
        path: pathForPhoto(photo),
      })),
    }]
    : [];
}
