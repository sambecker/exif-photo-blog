'use client';

import { Command } from 'cmdk';
import {
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  PATH_ADMIN_BASELINE,
  PATH_ADMIN_COMPONENTS,
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_INSIGHTS,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_RECIPES,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
  PATH_FEED_INFERRED,
  PATH_GRID_INFERRED,
  PATH_ROOT,
  PATH_SIGN_IN,
  pathForCamera,
  pathForFilmSimulation,
  pathForFocalLength,
  pathForLens,
  pathForPhoto,
  pathForRecipe,
  pathForTag,
} from '../../app/paths';
import Modal from '../Modal';
import { clsx } from 'clsx/lite';
import { useDebounce } from 'use-debounce';
import Spinner from '../Spinner';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BiDesktop, BiLockAlt, BiMoon, BiSun } from 'react-icons/bi';
import { IoInvertModeSharp } from 'react-icons/io5';
import { useAppState } from '@/state/AppState';
import { searchPhotosAction } from '@/photo/actions';
import { RiToolsFill } from 'react-icons/ri';
import { BiSolidUser } from 'react-icons/bi';
import { HiDocumentText } from 'react-icons/hi';
import { signOutAction } from '@/auth/actions';
import { getKeywordsForPhoto, titleForPhoto } from '@/photo';
import PhotoDate from '@/photo/PhotoDate';
import PhotoSmall from '@/photo/PhotoSmall';
import { FaCheck } from 'react-icons/fa6';
import { addHiddenToTags, formatTag } from '@/tag';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import CommandKItem from './CommandKItem';
import { CATEGORY_VISIBILITY, GRID_HOMEPAGE_ENABLED } from '@/app/config';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import InsightsIndicatorDot from '@/admin/insights/InsightsIndicatorDot';
import { PhotoSetCategories } from '@/category';
import { formatCameraText } from '@/camera';
import { labelForFilmSimulation } from '@/platforms/fujifilm/simulation';
import { formatFocalLength } from '@/focal';
import { formatRecipe } from '@/recipe';
import IconLens from '../icons/IconLens';
import { formatLensText } from '@/lens';
import IconTag from '../icons/IconTag';
import IconCamera from '../icons/IconCamera';
import IconPhoto from '../icons/IconPhoto';
import IconRecipe from '../icons/IconRecipe';
import IconFocalLength from '../icons/IconFocalLength';
import IconFilmSimulation from '../icons/IconFilmSimulation';
import IconLock from '../icons/IconLock';
import useVisualViewportHeight from '@/utility/useVisualViewport';
import useMaskedScroll from '../useMaskedScroll';

const DIALOG_TITLE = 'Global Command-K Menu';
const DIALOG_DESCRIPTION = 'For searching photos, views, and settings';

const LISTENER_KEYDOWN = 'keydown';
const MINIMUM_QUERY_LENGTH = 2;

type CommandKItem = {
  label: ReactNode
  explicitKey?: string
  keywords?: string[]
  accessory?: ReactNode
  annotation?: ReactNode
  annotationAria?: string
  path?: string
  action?: () => void | Promise<void | boolean>
}

type CommandKSection = {
  heading: string
  accessory?: ReactNode
  items: CommandKItem[]
}

const renderToggle = (
  label: string,
  onToggle?: Dispatch<SetStateAction<boolean>>,
  isEnabled?: boolean,
): CommandKItem => ({
  label: `Toggle ${label}`,
  action: () => onToggle?.(prev => !prev),
  annotation: isEnabled ? <FaCheck size={12} /> : undefined,
});

export default function CommandKClient({
  cameras,
  lenses,
  tags,
  recipes,
  simulations,
  focalLengths,
  showDebugTools,
  footer,
}: {
  showDebugTools?: boolean
  footer?: string
} & PhotoSetCategories) {
  const pathname = usePathname();

  const {
    isUserSignedIn,
    clearAuthStateAndRedirect,
    isCommandKOpen: isOpen,
    startUpload,
    photosCountHidden,
    uploadsCount,
    tagsCount,
    recipesCount,
    selectedPhotoIds,
    setSelectedPhotoIds,
    insightsIndicatorStatus,
    isGridHighDensity,
    areZoomControlsShown,
    arePhotosMatted,
    shouldShowBaselineGrid,
    shouldDebugImageFallbacks,
    shouldDebugInsights,
    shouldDebugRecipeOverlays,
    setIsCommandKOpen: setIsOpen,
    setShouldRespondToKeyboardCommands,
    setShouldShowBaselineGrid,
    setIsGridHighDensity,
    setAreZoomControlsShown,
    setArePhotosMatted,
    setShouldDebugImageFallbacks,
    setShouldDebugInsights,
    setShouldDebugRecipeOverlays,
  } = useAppState();

  const isOpenRef = useRef(isOpen);

  const refInput = useRef<HTMLInputElement>(null);
  const mobileViewportHeight = useVisualViewportHeight();
  const heightMaximum = '18rem';
  const maxHeight = useMemo(() => {
    const positionY = refInput.current?.getBoundingClientRect().y;
    return mobileViewportHeight && positionY
      ? `min(${mobileViewportHeight - positionY - 32}px, ${heightMaximum})`
      : heightMaximum;
  }, [mobileViewportHeight]);

  const refScroll = useRef<HTMLDivElement>(null);
  const { maskImage, updateMask } = useMaskedScroll({
    ref: refScroll,
    updateMaskOnEvents: false,
  });
  
  // Manage action/path waiting state
  const [keyWaiting, setKeyWaiting] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [isWaitingForAction, setIsWaitingForAction] = useState(false);
  const isWaiting = isPending || isWaitingForAction;
  const shouldCloseAfterWaiting = useRef(false);
  useEffect(() => {
    if (!isWaiting) {
      setKeyWaiting(undefined);
      if (shouldCloseAfterWaiting.current) {
        setIsOpen?.(false);
        shouldCloseAfterWaiting.current = false;
      }
    }
  }, [isWaiting, setIsOpen]);

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
    if (isOpen) {
      const timeout = setTimeout(updateMask, 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, updateMask]);

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
                accessory: <IconPhoto size={14} />,
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
    addHiddenToTags(tags, photosCountHidden)
  , [tags, photosCountHidden]);

  const categorySections: CommandKSection[] = useMemo(() =>
    CATEGORY_VISIBILITY
      .map(category => {
        switch (category) {
        case 'cameras': return {
          heading: 'Cameras',
          accessory: <IconCamera size={14} />,
          items: cameras.map(({ camera, count }) => ({
            label: formatCameraText(camera),
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForCamera(camera),
          })),
        };
        case 'lenses': return {
          heading: 'Lenses',
          accessory: <IconLens size={14} className="translate-y-[0.5px]" />,
          items: lenses.map(({ lens, count }) => ({
            label: formatLensText(lens, 'medium'),
            explicitKey: formatLensText(lens, 'long'),
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForLens(lens),
          })),
        };
        case 'tags': return {
          heading: 'Tags',
          accessory: <IconTag
            size={13}
            className="translate-x-[1px] translate-y-[0.75px]"
          />,
          items: tagsIncludingHidden.map(({ tag, count }) => ({
            label: formatTag(tag),
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForTag(tag),
          })),
        };
        case 'recipes': return {
          heading: 'Recipes',
          accessory: <IconRecipe
            size={15}
            className="translate-x-[-1px]"
          />,
          items: recipes.map(({ recipe, count }) => ({
            label: formatRecipe(recipe),
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForRecipe(recipe),
          })),
        };
        case 'films': return {
          heading: 'Film Simulations',
          accessory: <IconFilmSimulation size={14} />,
          items: simulations.map(({ simulation, count }) => ({
            label: labelForFilmSimulation(simulation).medium,
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForFilmSimulation(simulation),
          })),
        };
        case 'focal-lengths': return {
          heading: 'Focal Lengths',
          accessory: <IconFocalLength className="text-[14px]" />,
          items: focalLengths.map(({ focal, count }) => ({
            label: formatFocalLength(focal)!,
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForFocalLength(focal),
          })),
        };
        }
      })
      .filter(Boolean) as CommandKSection[]
  , [tagsIncludingHidden, cameras, lenses, recipes, simulations, focalLengths]);

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
      items: [
        renderToggle(
          'Zoom Controls',
          setAreZoomControlsShown,
          areZoomControlsShown,
        ),
        renderToggle(
          'Photo Matting',
          setArePhotosMatted,
          arePhotosMatted,
        ),
        renderToggle(
          'High Density Grid',
          setIsGridHighDensity,
          isGridHighDensity,
        ),
        renderToggle(
          'Image Fallbacks',
          setShouldDebugImageFallbacks,
          shouldDebugImageFallbacks,
        ),
        renderToggle(
          'Baseline Grid',
          setShouldShowBaselineGrid,
          shouldShowBaselineGrid,
        ),
        renderToggle(
          'Insights Debugging',
          setShouldDebugInsights,
          shouldDebugInsights,
        ),
        renderToggle(
          'Recipe Overlays',
          setShouldDebugRecipeOverlays,
          shouldDebugRecipeOverlays,
        ),
      ],
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
    items: [],
  };

  if (isUserSignedIn) {
    adminSection.items.push({
      label: 'Upload Photos',
      annotation: <IconLock narrow />,
      action: startUpload,
    });
    if (uploadsCount) {
      adminSection.items.push({
        label: `Uploads (${uploadsCount})`,
        annotation: <IconLock narrow />,
        path: PATH_ADMIN_UPLOADS,
      });
    }
    adminSection.items.push({
      label: 'Manage Photos',
      annotation: <IconLock narrow />,
      path: PATH_ADMIN_PHOTOS,
    });
    if (tagsCount) {
      adminSection.items.push({
        label: 'Manage Tags',
        annotation: <IconLock narrow />,
        path: PATH_ADMIN_TAGS,
      });
    }
    if (recipesCount) {
      adminSection.items.push({
        label: 'Manage Recipes',
        annotation: <IconLock narrow />,
        path: PATH_ADMIN_RECIPES,
      });
    }
    adminSection.items.push({
      label: selectedPhotoIds === undefined
        ? 'Batch Edit Photos ...'
        : 'Exit Batch Edit',
      annotation: <IconLock narrow />,
      path: selectedPhotoIds === undefined
        ? PATH_GRID_INFERRED
        : undefined,
      action: selectedPhotoIds === undefined
        ? () => setSelectedPhotoIds?.([])
        : () => setSelectedPhotoIds?.(undefined),
    }, {
      label: <span className="flex items-center gap-3">
        App Insights
        {insightsIndicatorStatus &&
          <InsightsIndicatorDot />}
      </span>,
      keywords: ['app insights'],
      annotation: <IconLock narrow />,
      path: PATH_ADMIN_INSIGHTS,
    }, {
      label: 'App Config',
      annotation: <IconLock narrow />,
      path: PATH_ADMIN_CONFIGURATION,
    });
    if (showDebugTools) {
      adminSection.items.push({
        label: 'Baseline Overview',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_BASELINE,
      }, {
        label: 'Components Overview',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_COMPONENTS,
      });
    }
    adminSection.items.push({
      label: 'Sign Out',
      action: () => signOutAction().then(clearAuthStateAndRedirect),
    });
  } else {
    adminSection.items.push({
      label: 'Sign In',
      path: PATH_SIGN_IN,
    });
  }

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      filter={(value, search, keywords) => {
        const searchFormatted = search.trim().toLocaleLowerCase();
        return (
          value.toLocaleLowerCase().includes(searchFormatted) ||
          keywords?.some(keyword => keyword.includes(searchFormatted))
        ) ? 1 : 0 ;
      }}
      loop
    >
      <Modal
        anchor='top'
        onClose={() => setIsOpen?.(false)}
        noPadding
        fast
      >
        <VisuallyHidden.Root>
          <DialogTitle>{DIALOG_TITLE}</DialogTitle>
          <DialogDescription>{DIALOG_DESCRIPTION}</DialogDescription>
        </VisuallyHidden.Root>
        <div className={clsx(
          'px-3 md:px-4',
          'pt-3 md:pt-4',
        )}>
          <div className="relative">
            <Command.Input
              ref={refInput}
              onChangeCapture={(e) => {
                setQueryLive(e.currentTarget.value);
                updateMask();
              }}
              className={clsx(
                'w-full min-w-0!',
                'focus:ring-0',
                isPlaceholderVisible || isLoading && 'pr-10!',
                'border-gray-200! dark:border-gray-800!',
                'focus:border-gray-200 dark:focus:border-gray-800',
                'placeholder:text-gray-400/80',
                'dark:placeholder:text-gray-700',
                'focus:outline-hidden',
                isPending && 'opacity-20',
              )}
              placeholder="Search photos, views, settings ..."
              disabled={isPending}
            />
            {isLoading && !isPending &&
              <span className={clsx(
                'absolute top-[9px] right-0 w-10',
                'flex items-center justify-center translate-y-[2px]',
              )}>
                <Spinner size={16} />
              </span>}
          </div>
        </div>
        <Command.List
          ref={refScroll}
          onScroll={updateMask}
          className={clsx(
            'overflow-y-auto',
            'mx-3 pt-2 pb-3.5',
            '[&>*>*>*]:mt-2.5',
          )}
          style={{ maskImage, maxHeight }}
        >
          <div className="-mt-2.5">
            <Command.Empty className="mt-1 pl-3 text-dim pb-1">
              {isLoading ? 'Searching ...' : 'No results found'}
            </Command.Empty>
            {queriedSections
              .concat(categorySections)
              .concat(sectionPages)
              .concat(adminSection)
              .concat(clientSections)
              .filter(({ items }) => items.length > 0)
              .map(({ heading, accessory, items }) =>
                <Command.Group
                  key={heading}
                  heading={<div className={clsx(
                    'flex items-center',
                    'px-2 py-1! pb-0.5',
                    'text-xs font-medium text-dim tracking-wider',
                    isPending && 'opacity-20',
                  )}>
                    {accessory &&
                      <div className="w-5">{accessory}</div>}
                    {heading}
                  </div>}
                  className={clsx(
                    'uppercase',
                    'select-none',
                  )}
                >
                  {items.map(({
                    label,
                    explicitKey,
                    keywords,
                    accessory,
                    annotation,
                    annotationAria,
                    path,
                    action,
                  }) => {
                    const key = `${heading} ${explicitKey ?? label}`;
                    return <CommandKItem
                      key={key}
                      label={label}
                      value={key}
                      keywords={keywords}
                      onSelect={() => {
                        if (action) {
                          const result = action();
                          if (result instanceof Promise) {
                            setKeyWaiting(key);
                            setIsWaitingForAction(true);
                            result.then(shouldClose => {
                              shouldCloseAfterWaiting.current =
                                shouldClose === true;
                              setIsWaitingForAction(false);
                            });
                          } else {
                            if (!path) { setIsOpen?.(false); }
                          }
                        }
                        if (path) {
                          if (path !== pathname) {
                            setKeyWaiting(key);
                            shouldCloseAfterWaiting.current = true;
                            startTransition(() => {
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
                      loading={key === keyWaiting}
                      disabled={isPending && key !== keyWaiting}
                    />;
                  })}
                </Command.Group>)}
            {footer && !queryLive &&
              <div className={clsx(
                'text-center text-base text-dim pt-1',
                'pb-2',
              )}>
                {footer}
              </div>}
          </div>
        </Command.List>
      </Modal>
    </Command.Dialog>
  );
}
