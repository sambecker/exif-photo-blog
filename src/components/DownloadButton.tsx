import { MdOutlineFileDownload } from 'react-icons/md';
import PathLoaderButton from './primitives/PathLoaderButton';
import { clsx } from 'clsx/lite';
import { Photo } from '@/photo';

export default function DownloadButton({
  photo,
  dim,
  className,
}: {
  photo: Photo
  dim?: boolean
  className?: string
}) {
  const {url, title} = photo;

  return (
    <PathLoaderButton
      path={url}
      className={clsx(
        className,
        dim ? 'text-dim' : 'text-medium',
        '-mx-0.5 translate-x-0.5',
        'sm:mx-0 sm:translate-x-0'
      )}
      icon={<MdOutlineFileDownload size={16} />}
      spinnerColor='dim'
      styleAs='link'
      shouldReplace
      handleAction={async () => {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = title
          ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
          : url.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }}
    />
  );
}
