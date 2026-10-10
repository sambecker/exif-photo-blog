'use client';

import { Command } from 'cmdk';
import { CSSProperties, ReactNode, Ref, useMemo } from 'react';
import { clsx } from 'clsx/lite';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import CommandKItem from '@/cmdk/CommandKItem';
import { COMMAND_K_MINIMUM_QUERY_LENGTH, filterCommandK } from '@/cmdk';
import usePhotoQuery from '@/photo/usePhotoQuery';
import { getKeywordsForPhoto, titleForPhoto } from '@/photo';
import PhotoSmall from '@/photo/PhotoSmall';
import PhotoDate from '@/photo/PhotoDate';
import { Albums } from '@/album';
import { Tags, formatTag, isTagPrivate } from '@/tag';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import { useAppText } from '@/i18n/state/client';
import { getCategoryTitle } from '@/category';
import IconPhoto from '@/components/icons/IconPhoto';
import IconAlbum from '@/components/icons/IconAlbum';
import IconTag from '@/components/icons/IconTag';
import Spinner from '@/components/Spinner';
import { Mention, pathForMention } from '.';

type MentionMenuItem = {
  mention: Mention
  keywords?: string[]
  accessory?: ReactNode
  annotation?: ReactNode
  annotationAria?: string
};

type MentionMenuSection = {
  heading: string
  accessory: ReactNode
  items: MentionMenuItem[]
};

export default function MentionMenu({
  ref,
  query,
  albums,
  tags,
  onSelect,
  className,
  style,
}: {
  ref?: Ref<HTMLDivElement>
  query: string
  albums: Albums
  tags: Tags
  onSelect: (mention: Mention) => void
  className?: string
  style?: CSSProperties
}) {
  const appText = useAppText();

  const {
    queryFormatted,
    photos,
    isLoading,
  } = usePhotoQuery({
    query,
    minimumQueryLength: COMMAND_K_MINIMUM_QUERY_LENGTH,
  });

  const sections = useMemo<MentionMenuSection[]>(() => [{
    heading: 'Photos',
    accessory: <IconPhoto size={14} />,
    items: photos.map(photo => ({
      mention: { type: 'photo', id: photo.id, title: titleForPhoto(photo) },
      // Include query so cmdk's client filter can't hide SQL matches
      keywords: [queryFormatted, ...getKeywordsForPhoto(photo)],
      accessory: <PhotoSmall photo={photo} />,
      annotation: <PhotoDate {...{ photo, timezone: undefined }} />,
    })),
  }, {
    heading: getCategoryTitle('albums', appText),
    accessory: <IconAlbum size={14} />,
    items: albums
      .filter(({ count }) => count > 0)
      .map(({ album, count }) => ({
        mention: { type: 'album', id: album.slug, title: album.title },
        annotation: formatCount(count),
        annotationAria: formatCountDescriptive(count),
      })),
  }, {
    heading: getCategoryTitle('tags', appText),
    accessory: <IconTag
      size={13}
      className="translate-x-[1px] translate-y-[0.75px]"
    />,
    items: tags
      .filter(({ tag }) => !isTagPrivate(tag))
      .map(({ tag, count }) => ({
        mention: { type: 'tag', id: tag, title: formatTag(tag) },
        annotation: formatCount(count),
        annotationAria: formatCountDescriptive(count),
      })),
  }], [photos, queryFormatted, albums, tags, appText]);

  return (
    <Command
      ref={ref}
      filter={filterCommandK}
      loop
      // Keep focus (and caret) in the editor while clicking results
      onMouseDown={e => e.preventDefault()}
      className={clsx(
        'component-surface',
        'w-80 max-w-full',
        'shadow-lg dark:shadow-xl',
        className,
      )}
      style={style}
    >
      <VisuallyHidden.Root>
        <Command.Input value={query} tabIndex={-1} readOnly aria-hidden />
      </VisuallyHidden.Root>
      <Command.List className="max-h-72 overflow-y-auto">
        <div className="flex flex-col p-1.5 gap-1.5">
          <Command.Empty className={clsx(
            'flex items-center gap-2',
            'px-2 py-1 text-dim text-[0.9rem]',
          )}>
            {isLoading
              ? <>
                <Spinner size={12} />
                {appText.cmdk.searching}
              </>
              : appText.cmdk.noResults}
          </Command.Empty>
          {sections
            .filter(({ items }) => items.length > 0)
            .map(({ heading, accessory, items }) =>
              <Command.Group
                key={heading}
                heading={<div className={clsx(
                  'flex items-center',
                  'px-2 pt-1 pb-1.5',
                  'text-xs font-medium text-dim tracking-wider',
                )}>
                  <div className="w-5">{accessory}</div>
                  {heading}
                </div>}
                className="uppercase select-none"
              >
                {items.map(({
                  mention,
                  keywords,
                  accessory,
                  annotation,
                  annotationAria,
                }) => {
                  const key = [
                    heading,
                    mention.title,
                    pathForMention(mention),
                  ].join(' ');
                  return <CommandKItem
                    key={key}
                    value={key}
                    label={mention.title}
                    keywords={keywords}
                    accessory={accessory}
                    annotation={annotation}
                    annotationAria={annotationAria}
                    onSelect={() => onSelect(mention)}
                  />;
                })}
              </Command.Group>)}
        </div>
      </Command.List>
    </Command>
  );
}
