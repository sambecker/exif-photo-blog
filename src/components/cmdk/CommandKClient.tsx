'use client';

import { Command } from 'cmdk';
import {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  PATH_ADMIN_BASELINE,
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
  PATH_FEED_INFERRED,
  PATH_GRID_INFERRED,
  PATH_ROOT,
  PATH_SIGN_IN,
  pathForPhoto,
  pathForTag,
} from '../../site/paths';
import Modal from '../Modal';
import { clsx } from 'clsx/lite';
import { useDebounce } from 'use-debounce';
import Spinner from '../Spinner';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BiDesktop, BiMoon, BiSun } from 'react-icons/bi';
import { IoInvertModeSharp } from 'react-icons/io5';
import { useAppState } from '@/state/AppState';
import { searchPhotosAction } from '@/photo/actions';
import { RiToolsFill } from 'react-icons/ri';
import { BiLockAlt, BiSolidUser } from 'react-icons/bi';
import { HiDocumentText } from 'react-icons/hi';
import { signOutAndRedirectAction } from '@/auth/actions';
import { TbPhoto } from 'react-icons/tb';
import { getKeywordsForPhoto, titleForPhoto } from '@/photo';
import PhotoDate from '@/photo/PhotoDate';
import PhotoSmall from '@/photo/PhotoSmall';
import { FaCheck } from 'react-icons/fa6';
import { Tags, addHiddenToTags, formatTag } from '@/tag';
import { FaTag } from 'react-icons/fa';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import CommandKItem from './CommandKItem';
import { GRID_HOMEPAGE_ENABLED } from '@/site/config';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

const DIALOG_TITLE = 'Global Command-K Menu';
const DIALOG_DESCRIPTION = 'For searching photos, views, and settings';

const LISTENER_KEYDOWN = 'keydown';
const MINIMUM_QUERY_LENGTH = 2;

type CommandKItem = {
  label: string
  keywords?: string[]
  accessory?: ReactNode
  annotation?: ReactNode
  annotationAria?: string
  path?: string
  action?: () => void | Promise<void>
}

export type CommandKSection = {
  heading: string
  accessory?: ReactNode
  items: CommandKItem[]
}

export default function CommandKClient({
  tags,
  serverSections = [],
  showDebugTools,
  footer,
}: {
  tags: Tags
  serverSections?: CommandKSection[]
  showDebugTools?: boolean
  footer?: string
}) {
  const pathname = usePathname();

  const {
    isUserSignedIn,
    setUserEmail,
    isCommandKOpen: isOpen,
    hiddenPhotosCount,
    selectedPhotoIds,
    setSelectedPhotoIds,
    isGridHighDensity,
    arePhotosMatted,
    shouldShowBaselineGrid,
    shouldDebugImageFallbacks,
    setIsCommandKOpen: setIsOpen,
    setShouldRespondToKeyboardCommands,
    setShouldShowBaselineGrid,
    setIsGridHighDensity,
    setArePhotosMatted,
    setShouldDebugImageFallbacks,
  } = useAppState();

  const isOpenRef = useRef(isOpen);
  
  const [isPending, startTransition] = useTransition();
  const [keyPending, setKeyPending] = useState<string>();
  const shouldCloseAfterPending = useRef(false);

  useEffect(() => {
    if (!isPending) {
      setKeyPending(undefined);
      if (shouldCloseAfterPending.current) {
        setIsOpen?.(false);
        shouldCloseAfterPending.current = false;
      }
    }
  }, [isPending, setIsOpen]);

  // Raw query values
  const [queryLiveRaw, setQueryLive] = useState('');
  const [queryDebouncedRaw] =
    useDebounce(queryLiveRaw, 500, { trailing: true });
  const isPlaceholderVisible = queryLiveRaw === '';

  // Parameterized query values
  const queryLive = useMemo(() =>
    queryLiveRaw.trim().toLocaleLowerCase(), [queryLiveRaw]);
  const queryDebounced = useMemo(() =>
    queryDebouncedRaw.trim().toLocaleLowerCase(), [queryDebouncedRaw]);

  const [isLoading, setIsLoading] = useState(false);
  const [queriedSections, setQueriedSections] = useState<CommandKSection[]>([]);

  const { setTheme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen?.((open) => !open);
      }
    };
    document.addEventListener(LISTENER_KEYDOWN, down);
    return () => document.removeEventListener(LISTENER_KEYDOWN, down);
  }, [setIsOpen]);

  useEffect(() => {
    if (queryDebounced.length >= MINIMUM_QUERY_LENGTH && !isPending) {
      setIsLoading(true);
      searchPhotosAction(queryDebounced)
        .then(photos => {
          if (isOpenRef.current) {
            setQueriedSections(photos.length > 0
              ? [{
                heading: 'Photos',
                accessory: <TbPhoto size={14} />,
                items: photos.map(photo => ({
                  label: titleForPhoto(photo),
                  keywords: getKeywordsForPhoto(photo),
                  annotation: <PhotoDate {...{ photo, timezone: undefined }} />,
                  accessory: <PhotoSmall photo={photo} />,
                  path: pathForPhoto({ photo }),
                })),
              }]
              : []);
          } else {
            // Ignore stale requests that come in after dialog is closed
            setQueriedSections([]);
          }
          setIsLoading(false);
        })
        .catch(e => {
          console.error(e);
          setQueriedSections([]);
          setIsLoading(false);
        });
    }
  }, [queryDebounced, isPending]);

  useEffect(() => {
    if (queryLive === '') {
      setQueriedSections([]);
      setIsLoading(false);
    } else if (queryLive.length >= MINIMUM_QUERY_LENGTH) {
      setIsLoading(true);
    }
  }, [queryLive]);

  useEffect(() => {
    if (isOpen) {
      setShouldRespondToKeyboardCommands?.(false);
    } else if (!isOpen) {
      setQueryLive('');
      setQueriedSections([]);
      setIsLoading(false);
      setTimeout(() => setShouldRespondToKeyboardCommands?.(true), 500);
    }
  }, [isOpen, setShouldRespondToKeyboardCommands]);

  const tagsIncludingHidden = useMemo(() =>
    addHiddenToTags(tags, hiddenPhotosCount)
  , [tags, hiddenPhotosCount]);

  const SECTION_TAGS: CommandKSection = {
    heading: 'Tags',
    accessory: <FaTag
      size={10}
      className="translate-x-[1px] translate-y-[0.75px]"
    />,
    items: tagsIncludingHidden.map(({ tag, count }) => ({
      label: formatTag(tag),
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
      path: pathForTag(tag),
    })),
  };

  const clientSections: CommandKSection[] = [{
    heading: 'Theme',
    accessory: <IoInvertModeSharp
      size={14}
      className="translate-y-[0.5px] translate-x-[-1px]"
    />,
    items: [{
      label: 'Use System',
      annotation: <BiDesktop />,
      action: () => setTheme('system'),
    }, {
      label: 'Light Mode',
      annotation: <BiSun size={16} className="translate-x-[1.25px]" />,
      action: () => setTheme('light'),
    }, {
      label: 'Dark Mode',
      annotation: <BiMoon className="translate-x-[1px]" />,
      action: () => setTheme('dark'),
    }],
  }];

  if (isUserSignedIn && showDebugTools) {
    clientSections.push({
      heading: 'Debug Tools',
      accessory: <RiToolsFill size={16} className="translate-x-[-1px]" />,
      items: [{
        label: 'Toggle Photo Matting',
        action: () => setArePhotosMatted?.(prev => !prev),
        annotation: arePhotosMatted ? <FaCheck size={12} /> : undefined,
      }, {
        label: 'Toggle High Density Grid',
        action: () => setIsGridHighDensity?.(prev => !prev),
        annotation: isGridHighDensity ? <FaCheck size={12} /> : undefined,
      }, {
        label: 'Toggle Image Fallbacks',
        action: () => setShouldDebugImageFallbacks?.(prev => !prev),
        annotation: shouldDebugImageFallbacks
          ? <FaCheck size={12} />
          : undefined,
      }, {
        label: 'Toggle Baseline Grid',
        action: () => setShouldShowBaselineGrid?.(prev => !prev),
        annotation: shouldShowBaselineGrid ? <FaCheck size={12} /> : undefined,
      }],
    });
  }

  const pagesItems: CommandKItem[] = [{
    label: 'Home',
    path: PATH_ROOT,
  }];

  if (GRID_HOMEPAGE_ENABLED) {
    pagesItems.push({
      label: 'Feed',
      path: PATH_FEED_INFERRED,
    });
  } else {
    pagesItems.push({
      label: 'Grid',
      path: PATH_GRID_INFERRED,
    });
  }

  const sectionPages: CommandKSection = {
    heading: 'Pages',
    accessory: <HiDocumentText size={15} className="translate-x-[-1px]" />,
    items: pagesItems,
  };

  const adminSection: CommandKSection = {
    heading: 'Admin',
    accessory: <BiSolidUser size={15} className="translate-x-[-1px]" />,
    items: isUserSignedIn
      ? ([{
        label: 'Manage Photos',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_PHOTOS,
      }, {
        label: 'Manage Uploads',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_UPLOADS,
      }, {
        label: 'Manage Tags',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_TAGS,
      }, {
        label: 'App Config',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_CONFIGURATION,
      }, {
        label: selectedPhotoIds === undefined
          ? 'Select Multiple Photos'
          : 'Exit Select Multiple Photos',
        annotation: <BiLockAlt />,
        path: selectedPhotoIds === undefined
          ? PATH_GRID_INFERRED
          : undefined,
        action: selectedPhotoIds === undefined
          ? () => setSelectedPhotoIds?.([])
          : () => setSelectedPhotoIds?.(undefined),
      }] as CommandKItem[])
        .concat(showDebugTools
          ? [{
            label: 'Baseline Overview',
            path: PATH_ADMIN_BASELINE,
          }]
          : [])
        .concat({
          label: 'Sign Out',
          action: () => {
            signOutAndRedirectAction().then(() => setUserEmail?.(undefined));
          },
        })
      : [{
        label: 'Sign In',
        path: PATH_SIGN_IN,
      }],
  };

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      filter={(value, search, keywords) => {
        const searchFormatted = search.trim().toLocaleLowerCase();
        return (
          value.toLocaleLowerCase().includes(searchFormatted) ||
          keywords?.includes(searchFormatted)
        ) ? 1 : 0 ;
      }}
      loop
    >
      <Modal
        anchor='top'
        onClose={() => setIsOpen?.(false)}
        fast
      >
        <div className="space-y-1.5">
          <div className="relative">
            <VisuallyHidden.Root>
              <DialogTitle>{DIALOG_TITLE}</DialogTitle>
              <DialogDescription>{DIALOG_DESCRIPTION}</DialogDescription>
            </VisuallyHidden.Root>
            <Command.Input
              onChangeCapture={(e) => setQueryLive(e.currentTarget.value)}
              className={clsx(
                'w-full !min-w-0',
                'focus:ring-0',
                isPlaceholderVisible || isLoading && '!pr-8',
                '!border-gray-200 dark:!border-gray-800',
                'focus:border-gray-200 focus:dark:border-gray-800',
                'placeholder:text-gray-400/80',
                'placeholder:dark:text-gray-700',
                isPending && 'opacity-20',
              )}
              placeholder="Search photos, views, settings ..."
              disabled={isPending}
            />
            {isLoading && !isPending &&
              <span className={clsx(
                'absolute top-2.5 right-0 w-8',
                'flex items-center justify-center translate-y-[2px]',
              )}>
                <Spinner size={16} />
              </span>}
          </div>
          <Command.List className={clsx(
            'relative overflow-y-auto',
            'max-h-48 sm:max-h-72',
          )}>
            <Command.Empty className="mt-1 pl-3 text-dim">
              {isLoading ? 'Searching ...' : 'No results found'}
            </Command.Empty>
            {queriedSections
              .concat(SECTION_TAGS)
              .concat(serverSections)
              .concat(sectionPages)
              .concat(adminSection)
              .concat(clientSections)
              .filter(({ items }) => items.length > 0)
              .map(({ heading, accessory, items }) =>
                <Command.Group
                  key={heading}
                  heading={<div className={clsx(
                    'flex items-center',
                    'px-2',
                    isPending && 'opacity-20',
                  )}>
                    {accessory &&
                      <div className="w-5">{accessory}</div>}
                    {heading}
                  </div>}
                  className={clsx(
                    'uppercase',
                    'select-none',
                    '[&>*:first-child]:py-1',
                    '[&>*:first-child]:font-medium',
                    '[&>*:first-child]:text-dim',
                    '[&>*:first-child]:text-xs',
                    '[&>*:first-child]:tracking-wider',
                  )}
                >
                  {items.map(({
                    label,
                    keywords,
                    accessory,
                    annotation,
                    annotationAria,
                    path,
                    action,
                  }) => {
                    const key = `${heading} ${label}`;
                    return <CommandKItem
                      key={key}
                      label={label}
                      value={key}
                      keywords={keywords}
                      onSelect={() => {
                        if (action) {
                          action();
                          if (!path) { setIsOpen?.(false); }
                        }
                        if (path) {
                          if (path !== pathname) {
                            setKeyPending(key);
                            startTransition(() => {
                              shouldCloseAfterPending.current = true;
                              router.push(path, { scroll: true });
                            });
                          } else {
                            setIsOpen?.(false);
                          }
                        }
                      }}
                      accessory={accessory}
                      annotation={annotation}
                      annotationAria={annotationAria}
                      loading={key === keyPending}
                      disabled={isPending && key !== keyPending}
                    />;
                  })}
                </Command.Group>)}
            {footer && !queryLive &&
              <div className="text-center text-dim pt-3 sm:pt-4">
                {footer}
              </div>}
          </Command.List>
        </div>
      </Modal>
    </Command.Dialog>
  );
}
