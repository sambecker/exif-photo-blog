import PhotoForm from '@/photo/PhotoForm';
import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_UPLOADS } from '@/site/paths';
import { extractFormDataFromUploadPath } from '@/photo/server';

interface Params {
  params: { uploadPath: string }
}

export default async function UploadPage({ params: { uploadPath } }: Params) {
  const {
    blobId,
    photoForm,
  } = await extractFormDataFromUploadPath(uploadPath);

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_UPLOADS}
      backLabel="Uploads"
      breadcrumb={blobId}
    >
      {photoForm
        ? <PhotoForm initialPhotoForm={photoForm} />
        : null}
    </AdminChildPage>
  );
};
