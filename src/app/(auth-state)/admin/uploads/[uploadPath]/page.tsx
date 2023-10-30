import PhotoForm from '@/photo/PhotoForm';
import { ExifData, ExifParserFactory } from 'ts-exif-parser';
import { convertExifToFormData } from '@/photo/form';
import AdminChildPage from '@/components/AdminChildPage';
import { getExtensionFromBlobUrl, getIdFromBlobUrl } from '@/services/blob';
import { PATH_ADMIN_UPLOADS } from '@/site/paths';
import {
  FujifilmSimulation,
  getFujifilmSimulationFromMakerNote,
  isExifForFujifilm,
} from '@/vendors/fujifilm';

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

  let exifDataForm: ExifData | undefined;
  let filmSimulation: FujifilmSimulation | undefined;

  if (fileBytes) {
    const parser = ExifParserFactory.create(Buffer.from(fileBytes));

    // Data for form
    parser.enableBinaryFields(false);
    exifDataForm = parser.parse();

    // Capture film simulation for Fujifilm cameras
    if (isExifForFujifilm(exifDataForm)) {
      // Parse exif data again with binary fields
      // in order to access MakerNote tag
      parser.enableBinaryFields(true);
      const exifDataBinary = parser.parse();
      const makerNote = exifDataBinary.tags?.MakerNote;
      if (Buffer.isBuffer(makerNote)) {
        filmSimulation = getFujifilmSimulationFromMakerNote(makerNote);
      }
    }
  }

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_UPLOADS}
      backLabel="Uploads"
      breadcrumb={getIdFromBlobUrl(url)}
    >
      {exifDataForm
        ? <PhotoForm
          initialPhotoForm={{
            extension,
            url: decodeURIComponent(uploadPath),
            ...convertExifToFormData(exifDataForm, filmSimulation),
          }}
        />
        : null}
    </AdminChildPage>
  );
};
