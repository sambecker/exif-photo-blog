'use client';

import { TINT_FOLDERS } from '@/app/config';
import CategoryIcon from '@/category/CategoryIcon';
import type { CategoryKey } from '@/category';
import PhotoFolder from '@/components/folder/PhotoFolder';
import IconFavs from '@/components/icons/IconFavs';
import IconRecents from '@/components/icons/IconRecents';
import PhotoFilmIcon from '@/film/PhotoFilmIcon';
import { isStringFujifilmSimulation } from '@/platforms/fujifilm/simulation';
import { TAG_FAVS } from '@/tag';
import clsx from 'clsx/lite';
import { ReactNode, useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';
import type { LibrarySetFolder } from '.';

export default function LibrarySection({
  category,
  title,
  folders,
}: {
  category: CategoryKey
  title: string
  folders: LibrarySetFolder[]
}) {
  const [isOpen, setIsOpen] = useState(true);
  const contentId = `library-section-${category}`;
  const showFilmCaptionIcons = category === 'films' &&
    folders.some(({ key }) => isStringFujifilmSimulation(key));

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
    if (showFilmCaptionIcons) {
      return <PhotoFilmIcon
        film={key}
        height={13}
        className="translate-y-[-0.5px]"
      />;
    }
  };

  return (
    <div className="group/section border-t border-medium pt-1.5 space-y-4">
      <button
        type="button"
        className={clsx(
          'link w-full',
          'flex items-center gap-1',
          'text-[13px] uppercase tracking-wide',
          'text-dim',
          'hover:text-medium group-hover/section:text-medium',
          'active:opacity-75',
          'transition-[color,opacity] duration-200',
          'select-none',
        )}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(isOpen => !isOpen)}
      >
        <span className={clsx(
          'grid w-[1rem] shrink-0',
          '[&>*]:col-start-1 [&>*]:row-start-1',
          '[&>*]:place-self-center',
        )}>
          <span className={clsx(
            'transition-opacity duration-200',
            'group-hover/section:opacity-0',
          )}>
            <CategoryIcon category={category} />
          </span>
          <LuChevronRight
            size={14}
            className={clsx(
              'opacity-0 transition-[opacity,rotate] duration-200',
              'group-hover/section:opacity-100',
              isOpen && 'rotate-90',
            )}
          />
        </span>
        {title}
      </button>
      {isOpen &&
        <div
          id={contentId}
          className={clsx(
            'grid gap-3',
            'grid-cols-2 sm:grid-cols-3',
            'lg:grid-cols-5',
          )}
        >
          {folders.map(folder =>
            <div
              key={folder.key}
              className={clsx(
                'w-full h-full',
                'flex items-center justify-center',
              )}
            >
              <PhotoFolder
                photos={folder.photos}
                caption={folder.caption}
                captionIcon={getFolderCaptionIcon(folder.key)}
                count={folder.count}
                href={folder.path}
                tint={TINT_FOLDERS ? 'on' : 'off'}
              />
            </div>)}
        </div>}
    </div>
  );
}
