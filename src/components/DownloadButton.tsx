import { MdOutlineFileDownload } from 'react-icons/md';
import { clsx } from 'clsx/lite';
import { downloadFileNameForPhoto, Photo } from '@/photo';
import LoaderButton from './primitives/LoaderButton';
import { useState } from 'react';
import { downloadFileFromBrowser } from '@/utility/url';

export default function DownloadButton({
  photo,
  className,
}: {
  photo: Photo
  className?: string
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderButton
      title="Download Original File"
      className={clsx(
        className,
        'text-medium',
      )}
      icon={<MdOutlineFileDownload size={18} />}
      spinnerColor='dim'
      styleAs='link'
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        downloadFileFromBrowser(photo.url, downloadFileNameForPhoto(photo))
          .finally(() => setIsLoading(false));
      }}
      hideFocusOutline
    />
  );
}
