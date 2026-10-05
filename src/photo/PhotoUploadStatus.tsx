'use client';

import { clsx } from 'clsx/lite';
import { useUploadState } from '@/admin/upload/UploadState';
import Spinner from '@/components/Spinner';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import ProgressBar from '@/components/primitives/ProgressBar';
import { useAppText } from '@/i18n/state/client';

export default function PhotoUploadStatus({
  showButton = false,
  expandStatus = false,
  showProgressBarBackground = true,
}: {
  showButton?: boolean
  expandStatus?: boolean
  showProgressBarBackground?: boolean
}) {
  const {
    uploadState: {
      isUploading,
      uploadError,
      fileUploadName,
      fileUploadIndex,
      filesLength,
      uploadProgress,
    },
    isFinishingUpload: isFinishing,
  } = useUploadState();

  const appText = useAppText();

  const uploadStatusText = filesLength > 1
    ? appText.utility.paginate(fileUploadIndex + 1, filesLength)
    : undefined;

  return (
    <div className={clsx(
      'flex flex-col gap-1.5 min-w-0 overflow-hidden',
      !showButton && 'w-full',
      expandStatus && 'grow text-left',
    )}>
      <div className="flex w-full items-center gap-4 overflow-hidden">
        {isUploading && !showButton &&
          <Spinner
            className="text-dim translate-y-[1px]"
            color="text"
            size={14}
          />}
        {uploadError
          ? <span className="text-error">
            {uploadError}
          </span>
          : <span className="truncate">
            {isUploading
              ? isFinishing
                ? <>
                  {appText.utility.finishing}
                </>
                : <>
                  {!showButton && uploadStatusText
                    ? <>
                      <ResponsiveText shortText={uploadStatusText}>
                        {appText.utility.uploading} {uploadStatusText}
                      </ResponsiveText>
                      {': '}
                      {fileUploadName}
                    </>
                    : <ResponsiveText shortText={fileUploadName}>
                      {appText.utility.uploading} {fileUploadName}
                    </ResponsiveText>}
                </>
              : !showButton && <>Initializing</>}
          </span>}
      </div>
      {!showButton && isUploading && !isFinishing && !uploadError &&
        <ProgressBar
          progress={uploadProgress ?? 0}
          className={clsx(
            'absolute! top-0 left-0 w-full',
            'h-[2px]',
            showProgressBarBackground && 'bg-medium',
          )}
        />}
    </div>
  );
}
