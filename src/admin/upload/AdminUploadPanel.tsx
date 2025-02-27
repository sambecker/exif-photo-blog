'use client';

import Container from '@/components/Container';
import LoaderButton from '@/components/primitives/LoaderButton';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import { useAppState } from '@/state/AppState';
import clsx from 'clsx';
import { IoCloseSharp } from 'react-icons/io5';

export default function AdminUploadPanel() {
  const { uploadState: {
    isUploading,
    filesLength,
    fileUploadIndex,
    fileUploadName,
  } } = useAppState();

  return (
    <SiteGrid contentMain={
      <Container
        color="gray"
        padding="tight"
        className="p-2! pl-4! text-main!"
      >
        <div className="flex w-full items-center gap-2">
          <div className="grow">
            {isUploading
              ? <div className={clsx('flex items-center gap-4')}>
                <span className="inline-block truncate">
                  {/* eslint-disable-next-line max-len */}
                  Uploading {fileUploadIndex + 1} of {filesLength}: {fileUploadName}
                </span>
                <Spinner
                  className="text-dim translate-y-[1px]"
                  color="text"
                  size={14}
                />
              </div>
              : 'Upload Photos'}
          </div>
          <LoaderButton 
            icon={<IoCloseSharp
              size={18}
              className="translate-y-[0.5px]"
            />}
          />
        </div>
      </Container>}
    />
  );
}
