import PhotoForm from '@/photo/PhotoForm';
import { ExifParserFactory } from 'ts-exif-parser';
import { convertExifToFormData } from '@/photo/form';
import AdminChildPage from '@/components/AdminChildPage';
import { getExtensionFromBlobUrl, getIdFromBlobUrl } from '@/services/blob';
import { PATH_ADMIN_UPLOADS } from '@/site/paths';

interface Params {
  params: { uploadPath: string }
}

export default async function UploadPage({ params: { uploadPath } }: Params) {
  const url = decodeURIComponent(uploadPath);

  const extension = getExtensionFromBlobUrl(url);

  const fileBytes = uploadPath
    ? await fetch(url)
      .then(res => res.arrayBuffer())
    : undefined;

  let data;

  if (fileBytes) {
    data = ExifParserFactory
      .create(Buffer.from(fileBytes))
      .parse();
  }

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_UPLOADS}
      backLabel="Uploads"
      breadcrumb={getIdFromBlobUrl(url)}
    >
      {data
        ? <PhotoForm
          initialPhotoForm={{
            extension,
            url: decodeURIComponent(uploadPath),
            ...convertExifToFormData(data),
          }}
        />
        : null}
    </AdminChildPage>
  );
};
