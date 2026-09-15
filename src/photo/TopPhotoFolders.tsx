'use client';

import { TINT_FOLDERS } from '@/app/config';
import { PATH_LIBRARY } from '@/app/path';
import PhotoFolder from '@/components/folder/PhotoFolder';
import IconFavs from '@/components/icons/IconFavs';
import IconRecents from '@/components/icons/IconRecents';
import MaskedScroll from '@/components/MaskedScroll';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';
import PhotoFilmIcon from '@/film/PhotoFilmIcon';
import { useAppText } from '@/i18n/state/client';
import type { LibrarySetFolder } from '@/library';
import { isStringFujifilmSimulation } from '@/platforms/fujifilm/simulation';
import { TAG_FAVS } from '@/tag';
import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import { BiExpandVertical } from 'react-icons/bi';

const SCALE_DOWN_FOLDERS = false;

const FOLDER_WIDTH = SCALE_DOWN_FOLDERS ? 110 : 143;
// Match PhotoFolder aspect (143×93)
const FOLDER_HEIGHT = FOLDER_WIDTH * 93 / 143;
// Room for hover peeks that stick above the folder body
const PEEK_OVERFLOW = 48;

export default function TopPhotoFolders({
  folders,
  className,
}: {
  folders: LibrarySetFolder[]
  className?: string
}) {
  const { utility } = useAppText();

  const getFolderCaptionIcon = (key: string): ReactNode => {
    switch (key) {
      case TAG_FAVS:
        return <IconFavs
          size={10}
          className="translate-y-[-0.5px]"
          highlight
        />;
      case 'recents':
        return <IconRecents size={10} solid />;
    }
    if (isStringFujifilmSimulation(key)) {
      return <PhotoFilmIcon
        film={key}
        height={13}
        className="translate-y-[-0.5px]"
      />;
    }
  };

  return (
    <MaskedScroll
      direction="horizontal"
      className={clsx(
        'flex items-start gap-x-3',
        // Peek overflow lives in padding so overflow-x scroll doesn't clip it;
        // negative margin cancels the layout shift
        'pb-1',
        className,
      )}
      style={{
        paddingTop: PEEK_OVERFLOW,
        marginTop: -PEEK_OVERFLOW,
      }}
      fadeSize={50}
    >
      {folders.map(folder =>
        <PhotoFolder
          key={folder.key}
          photos={folder.photos}
          caption={folder.caption}
          captionIcon={getFolderCaptionIcon(folder.key)}
          count={folder.count}
          href={folder.path}
          tint={TINT_FOLDERS ? 'on' : 'off'}
          width={FOLDER_WIDTH}
        />)}
      <div
        className="shrink-0 flex items-center"
        style={{ height: FOLDER_HEIGHT }}
      >
        {/* Wrapper so LoaderButton's self-start doesn't defeat centering */}
        <div>
          <PathLoaderButton
            path={PATH_LIBRARY}
            icon={<BiExpandVertical
              className="text-medium translate-y-[0.75px] text-[0.9rem]"
            />}
            hideText="never"
            className={clsx(
              'h-auto',
              'pt-[5px] pb-1.5 pl-1 pr-2.5',
              'gap-x-[3px] uppercase tracking-wide',
            )}
          >
            {utility.more}
          </PathLoaderButton>
        </div>
      </div>
    </MaskedScroll>
  );
}
