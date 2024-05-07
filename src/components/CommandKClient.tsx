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
  PATH_SIGN_IN,
  pathForPhoto,
} from '../site/paths';
import Modal from './Modal';
import { clsx } from 'clsx/lite';
import { useDebounce } from 'use-debounce';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BiDesktop, BiMoon, BiSun } from 'react-icons/bi';
import { IoInvertModeSharp } from 'react-icons/io5';
import { useAppState } from '@/state/AppState';
import { queryPhotosByTitleAction } from '@/photo/actions';
import { RiToolsFill } from 'react-icons/ri';
import { BiLockAlt, BiSolidUser } from 'react-icons/bi';
import { HiDocumentText } from 'react-icons/hi';
import { signOutAndRedirectAction } from '@/auth/actions';
import { TbPhoto } from 'react-icons/tb';
import { getKeywordsForPhoto, titleForPhoto } from '@/photo';
import PhotoDate from '@/photo/PhotoDate';
import PhotoTiny from '@/photo/PhotoTiny';
import { FaCheck } from 'react-icons/fa6';

const LISTENER_KEYDOWN = 'keydown';
const MINIMUM_QUERY_LENGTH = 2;

type CommandKItem = {
  label: string
  keywords?: string[]
  annotation?: ReactNode
  annotationAria?: string
  accessory?: ReactNode
  path?: string
  action?: () => void | Promise<void>
}

export type CommandKSection = {
  heading: string
  accessory?: ReactNode
  items: CommandKItem[]
}

export default function CommandKClient({
  serverSections = [],
  showDebugTools,
  footer,
}: {
  serverSections?: CommandKSection[]
  showDebugTools?: boolean
  footer?: string
}) {
  const {
    isUserSignedIn,
    setUserEmail,
    isCommandKOpen: isOpen,
    shouldShowBaselineGrid,
    shouldDebugBlur,
    setIsCommandKOpen: setIsOpen,
    setShouldRespondToKeyboardCommands,
    setShouldShowBaselineGrid,
    setShouldDebugBlur,
  } = useAppState();

  const isOpenRef = useRef(isOpen);
  
  const [isPending, startTransition] = useTransition();
  const shouldCloseAfterPending = useRef(false);

  useEffect(() => {
    if (!isPending && shouldCloseAfterPending.current) {
      setIsOpen?.(false);
      shouldCloseAfterPending.current = false;
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
      queryPhotosByTitleAction(queryDebounced).then(photos => {
        if (isOpenRef.current) {
          setQueriedSections(photos.length > 0
            ? [{
              heading: 'Photos',
              accessory: <TbPhoto size={14} />,
              items: photos.map(photo => ({
                label: titleForPhoto(photo),
                keywords: getKeywordsForPhoto(photo),
                annotation: <PhotoDate {...{ photo }} />,
                accessory: <PhotoTiny photo={photo} />,
                path: pathForPhoto(photo),
              })),
            }]
            : []);
        } else {
          // Ignore stale requests that come in after dialog is closed
          setQueriedSections([]);
        }
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
        label: 'Toggle Blur Debug',
        action: () => setShouldDebugBlur?.(prev => !prev),
        annotation: shouldDebugBlur ? <FaCheck size={12} /> : undefined,
      }, {
        label: 'Toggle Baseline Grid',
        action: () => setShouldShowBaselineGrid?.(prev => !prev),
        annotation: shouldShowBaselineGrid ? <FaCheck size={12} /> : undefined,
      }],
    });
  }

  const sectionPages: CommandKSection = {
    heading: 'Pages',
    accessory: <HiDocumentText size={15} className="translate-x-[-1px]" />,
    items: ([{
      label: 'Home',
      path: '/',
    }, {
      label: 'Grid',
      path:'/grid',
    }]),
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
      label="Global Command Menu"
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
        <div className={clsx('space-y-1.5', isPending && 'opacity-30')}>
          <div className="relative">
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
                    annotation,
                    annotationAria,
                    accessory,
                    path,
                    action,
                  }) =>
                    <Command.Item
                      key={`${heading} ${label}`}
                      value={`${heading} ${label}`}
                      keywords={keywords}
                      className={clsx(
                        'px-2',
                        accessory ? 'py-2' : 'py-1',
                        'rounded-md cursor-pointer tracking-wide',
                        'data-[selected=true]:bg-gray-100',
                        'data-[selected=true]:dark:bg-gray-900/75',
                      )}
                      onSelect={() => {
                        if (path) {
                          startTransition(() => {
                            shouldCloseAfterPending.current = true;
                            router.push(path, { scroll: true });
                          });
                        } else {
                          setIsOpen?.(false);
                          action?.();
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        {accessory}
                        <span className="grow text-ellipsis truncate">
                          {label}
                        </span>
                        {annotation &&
                          <span
                            className="text-dim whitespace-nowrap"
                            aria-label={annotationAria}
                          >
                            <span aria-hidden={Boolean(annotationAria)}>
                              {annotation}
                            </span>
                          </span>}
                      </div>
                    </Command.Item>)}
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
