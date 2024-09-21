import { MdOutlineFileDownload } from 'react-icons/md';
import { clsx } from 'clsx/lite';
import { downloadFileNameForPhoto, Photo } from '@/photo';
import LoaderButton from './primitives/LoaderButton';
import { useState } from 'react';

export default function DownloadButton({
  photo,
  dim,
  className,
}: {
  photo: Photo
  dim?: boolean
  className?: string
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderButton
      title="Download Original File"
      className={clsx(
        className,
        dim ? 'text-dim' : 'text-medium',
        '-mx-0.5 translate-x-0.5',
        'sm:mx-0 sm:translate-x-0'
      )}
      icon={<MdOutlineFileDownload size={18} />}
      spinnerColor='dim'
      styleAs='link'
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        const blob = await fetch(photo.url)
          .then(response => response.blob())
          .finally(() => setIsLoading(false));
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = downloadFileNameForPhoto(photo);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }}
    />
  );
}
