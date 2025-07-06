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
  PATH_FULL_INFERRED,
  PATH_GRID_INFERRED,
  PATH_SIGN_IN,
  pathForCamera,
  pathForFilm,
  pathForFocalLength,
  pathForLens,
  pathForPhoto,
  pathForRecipe,
  pathForTag,
  pathForYear,
  PREFIX_RECENTS,
} from '../app/paths';
import Modal from '../components/Modal';
import { clsx } from 'clsx/lite';
import { useDebounce } from 'use-debounce';
import Spinner from '../components/Spinner';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BiDesktop, BiLockAlt, BiMoon, BiSun } from 'react-icons/bi';
import { IoInvertModeSharp } from 'react-icons/io5';
import { useAppState } from '@/app/AppState';
import { searchPhotosAction } from '@/photo/actions';
import { RiToolsFill } from 'react-icons/ri';
import { signOutAction } from '@/auth/actions';
import { getKeywordsForPhoto, titleForPhoto } from '@/photo';
import PhotoDate from '@/photo/PhotoDate';
import PhotoSmall from '@/photo/PhotoSmall';
import { FaCheck } from 'react-icons/fa6';
import {
  addPrivateToTags,
  formatTag,
  isTagFavs,
  isTagPrivate,
  limitTagsByCount,
} from '@/tag';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import CommandKItem from './CommandKItem';
import {
  CATEGORY_VISIBILITY,
  GRID_HOMEPAGE_ENABLED,
  HIDE_TAGS_WITH_ONE_PHOTO,
} from '@/app/config';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import InsightsIndicatorDot from '@/admin/insights/InsightsIndicatorDot';
import { PhotoSetCategories } from '@/category';
import { formatCameraText } from '@/camera';
import { formatFocalLength } from '@/focal';
import { formatRecipe } from '@/recipe';
import IconLens from '../components/icons/IconLens';
import { formatLensText } from '@/lens';
import IconTag from '../components/icons/IconTag';
import IconCamera from '../components/icons/IconCamera';
import IconPhoto from '../components/icons/IconPhoto';
import IconRecipe from '../components/icons/IconRecipe';
import IconFocalLength from '../components/icons/IconFocalLength';
import IconFilm from '../components/icons/IconFilm';
import IconLock from '../components/icons/IconLock';
import IconYear from '../components/icons/IconYear';
import useVisualViewportHeight from '@/utility/useVisualViewport';
import useMaskedScroll from '../components/useMaskedScroll';
import { labelForFilm } from '@/film';
import IconFavs from '@/components/icons/IconFavs';
import { useAppText } from '@/i18n/state/client';
import LoaderButton from '@/components/primitives/LoaderButton';
import IconRecents from '@/components/icons/IconRecents';
import { CgFileDocument } from 'react-icons/cg';
import { FaRegUserCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const DIALOG_TITLE = 'Global Command-K Menu';
const DIALOG_DESCRIPTION = 'For searching photos, views, and settings';

const LISTENER_KEYDOWN = 'keydown';
const MINIMUM_QUERY_LENGTH = 2;

const MAX_HEIGHT = '20rem';

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
  recents,
  years: _years,
  cameras,
  lenses,
  tags: _tags,
  recipes,
  films,
  focalLengths,
  footer,
}: {
  footer?: string
} & PhotoSetCategories) {
  const pathname = usePathname();

  const {
    isUserSignedIn,
    clearAuthStateAndRedirectIfNecessary,
    isCommandKOpen: isOpen,
    startUpload,
    photosCountTotal,
    photosCountHidden = 0,
    uploadsCount,
    tagsCount,
    recipesCount,
    selectedPhotoIds,
    setSelectedPhotoIds,
    insightsIndicatorStatus,
    isGridHighDensity,
    areZoomControlsShown,
    arePhotosMatted,
    areAdminDebugToolsEnabled,
    shouldShowBaselineGrid,
    shouldDebugImageFallbacks,
    shouldDebugInsights,
    shouldDebugRecipeOverlays,
    setIsCommandKOpen: setIsOpen,
    setShouldShowBaselineGrid,
    setIsGridHighDensity,
    setAreZoomControlsShown,
    setArePhotosMatted,
    setShouldDebugImageFallbacks,
    setShouldDebugInsights,
    setShouldDebugRecipeOverlays,
  } = useAppState();

  const appText = useAppText();

  const isOpenRef = useRef(isOpen);

  const refInput = useRef<HTMLInputElement>(null);
  const mobileViewportHeight = useVisualViewportHeight();
  const maxHeight = useMemo(() => {
    const positionY = refInput.current?.getBoundingClientRect().y;
    return mobileViewportHeight && positionY
      ? `min(${mobileViewportHeight - positionY - 32}px, ${MAX_HEIGHT})`
      : MAX_HEIGHT;
  }, [mobileViewportHeight]);

  const refScroll = useRef<HTMLDivElement>(null);
  const { styleMask, updateMask } = useMaskedScroll({
    ref: refScroll,
    updateMaskOnEvents: false,
    hideScrollbar: false,
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
  }, [queryDebounced, isPending, appText]);

  useEffect(() => {
    if (queryLive === '') {
      setQueriedSections([]);
      setIsLoading(false);
    } else if (queryLive.length >= MINIMUM_QUERY_LENGTH) {
      setIsLoading(true);
    }
  }, [queryLive]);

  useEffect(() => {
    if (!isOpen) {
      setQueryLive('');
      setQueriedSections([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  const recent = recents[0];
  const recentsStatus = useMemo(() => {
    if (!recent) { return undefined; }
    const { count, lastModified } = recent;
    const subhead = appText.category.recentSubhead(
      formatDistanceToNow(lastModified),
    );
    return count ? { count, subhead } : undefined;
  }, [recent, appText]);

  const years = useMemo(() =>
    _years.filter(({ year }) => queryLive && year.includes(queryLive))
  , [_years, queryLive]);

  const tags = useMemo(() => {
    const tagsIncludingPrivate = photosCountHidden > 0
      ? addPrivateToTags(_tags, photosCountHidden)
      : _tags;
    return HIDE_TAGS_WITH_ONE_PHOTO
      ? limitTagsByCount(tagsIncludingPrivate, 2, queryLive)
      : tagsIncludingPrivate;
  }, [_tags, photosCountHidden, queryLive]);

  const categorySections: CommandKSection[] = useMemo(() =>
    CATEGORY_VISIBILITY
      .map(category => {
        switch (category) {
        case 'recents': return {
          heading: appText.category.recentPlural,
          accessory: <IconRecents size={15} />,
          items: recentsStatus ? [{
            label: recentsStatus.subhead,
            annotation: formatCount(recentsStatus.count),
            annotationAria: formatCountDescriptive(recentsStatus.count),
            path: PREFIX_RECENTS,
          }] : [],
        };
        case 'years': return {
          heading: appText.category.yearPlural,
          accessory: <IconYear size={14} />,
          items: years.map(({ year, count }) => ({
            label: year,
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForYear(year),
          })),
        };
        case 'cameras': return {
          heading: appText.category.cameraPlural,
          accessory: <IconCamera size={14} />,
          items: cameras.map(({ camera, count }) => ({
            label: formatCameraText(camera),
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForCamera(camera),
          })),
        };
        case 'lenses': return {
          heading: appText.category.lensPlural,
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
          heading: appText.category.tagPlural,
          accessory: <IconTag
            size={13}
            className="translate-x-[1px] translate-y-[0.75px]"
          />,
          items: tags.map(({ tag, count }) => ({
            explicitKey: formatTag(tag),
            label: <span className="flex items-center gap-[7px]">
              {formatTag(tag)}
              {isTagFavs(tag) &&
                <IconFavs
                  size={13}
                  className="translate-y-[-0.5px]"
                  highlight
                />}
              {isTagPrivate(tag) &&
                <IconLock
                  size={12}
                  className="text-dim translate-y-[-0.5px]"
                />}
            </span>,
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForTag(tag),
          })),
        };
        case 'recipes': return {
          heading: appText.category.recipePlural,
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
          heading: appText.category.filmPlural,
          accessory: <IconFilm size={14} />,
          items: films.map(({ film, count }) => ({
            label: labelForFilm(film).medium,
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForFilm(film),
          })),
        };
        case 'focal-lengths': return {
          heading: appText.category.focalLengthPlural,
          accessory: <IconFocalLength className="text-[14px]" />,
          items: focalLengths.map(({ focal, count }) => ({
            label: formatFocalLength(focal),
            annotation: formatCount(count),
            annotationAria: formatCountDescriptive(count),
            path: pathForFocalLength(focal),
          })),
        };
        }
      })
      .filter(Boolean) as CommandKSection[]
  , [
    appText,
    recentsStatus,
    years,
    cameras,
    lenses,
    tags,
    recipes,
    films,
    focalLengths,
  ]);

  const clientSections: CommandKSection[] = [{
    heading: appText.theme.theme,
    accessory: <IoInvertModeSharp
      size={14}
      className="translate-y-[0.5px] translate-x-[-1px]"
    />,
    items: [{
      label: appText.theme.system,
      annotation: <BiDesktop />,
      action: () => setTheme('system'),
    }, {
      label: appText.theme.light,
      annotation: <BiSun size={16} className="translate-x-[1.25px]" />,
      action: () => setTheme('light'),
    }, {
      label: appText.theme.dark,
      annotation: <BiMoon className="translate-x-[1px]" />,
      action: () => setTheme('dark'),
    }],
  }];

  if (isUserSignedIn && areAdminDebugToolsEnabled) {
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

  const pageFull: CommandKItem = {
    label: GRID_HOMEPAGE_ENABLED
      ? appText.nav.full
      : `${appText.nav.full} (${appText.nav.home})`,
    path: PATH_FULL_INFERRED,
  };

  const pageGrid: CommandKItem = {
    label: GRID_HOMEPAGE_ENABLED
      ? `${appText.nav.grid} (${appText.nav.home})`
      : appText.nav.grid,
    path: PATH_GRID_INFERRED,
  };

  const pageItems: CommandKItem[] = GRID_HOMEPAGE_ENABLED
    ? [pageGrid, pageFull]
    : [pageFull, pageGrid];

  const sectionPages: CommandKSection = {
    heading: 'Pages',
    accessory: <CgFileDocument size={14} className="translate-x-[-0.5px]" />,
    items: pageItems,
  };

  const adminSection: CommandKSection = {
    heading: 'Admin',
    accessory: <FaRegUserCircle
      size={13}
      className="translate-x-[-0.5px] translate-y-[0.5px]"
    />,
    items: [],
  };

  if (isUserSignedIn) {
    adminSection.items.push({
      label: appText.admin.uploadPhotos,
      annotation: <IconLock narrow />,
      action: startUpload,
    });
    if (uploadsCount) {
      adminSection.items.push({
        label: `${appText.admin.uploadPlural} (${uploadsCount})`,
        annotation: <IconLock narrow />,
        path: PATH_ADMIN_UPLOADS,
      });
    }
    adminSection.items.push({
      label: `${appText.admin.managePhotos} (${photosCountTotal})`,
      annotation: <IconLock narrow />,
      path: PATH_ADMIN_PHOTOS,
    });
    if (tagsCount) {
      adminSection.items.push({
        label: `${appText.admin.manageTags} (${tagsCount})`,
        annotation: <IconLock narrow />,
        path: PATH_ADMIN_TAGS,
      });
    }
    if (recipesCount) {
      adminSection.items.push({
        label: `${appText.admin.manageRecipes} (${recipesCount})`,
        annotation: <IconLock narrow />,
        path: PATH_ADMIN_RECIPES,
      });
    }
    adminSection.items.push({
      label: selectedPhotoIds === undefined
        ? appText.admin.batchEdit
        : appText.admin.batchExitEdit,
      annotation: <IconLock narrow />,
      path: selectedPhotoIds === undefined
        ? PATH_GRID_INFERRED
        : undefined,
      action: selectedPhotoIds === undefined
        ? () => setSelectedPhotoIds?.([])
        : () => setSelectedPhotoIds?.(undefined),
    }, {
      label: <span className="flex items-center gap-3">
        {appText.admin.appInsights}
        {insightsIndicatorStatus &&
          <InsightsIndicatorDot />}
      </span>,
      keywords: ['app insights'],
      annotation: <IconLock narrow />,
      path: PATH_ADMIN_INSIGHTS,
    }, {
      label: appText.admin.appConfig,
      annotation: <IconLock narrow />,
      path: PATH_ADMIN_CONFIGURATION,
    });
    if (areAdminDebugToolsEnabled) {
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
      label: appText.auth.signOut,
      action: () => signOutAction()
        .then(clearAuthStateAndRedirectIfNecessary)
        .then(() => setIsOpen?.(false)),
    });
  } else {
    adminSection.items.push({
      label: appText.auth.signIn,
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
        className="rounded-[12px]!"
        onClose={() => setIsOpen?.(false)}
        noPadding
        fast
      >
        <VisuallyHidden.Root>
          <DialogTitle>{DIALOG_TITLE}</DialogTitle>
          <DialogDescription>{DIALOG_DESCRIPTION}</DialogDescription>
        </VisuallyHidden.Root>
        <div className={clsx(
          'flex items-center justify-center gap-2',
          'py-1 px-4.5',
          'rounded-none bg-transparent',
          'border-b border-b-gray-400/25 dark:border-b-gray-800',
        )}>
          <Command.Input
            ref={refInput}
            onChangeCapture={(e) => {
              setQueryLive(e.currentTarget.value);
              updateMask();
            }}
            className={clsx(
              'grow p-0',
              'focus:ring-0',
              'border-transparent focus:border-transparent',
              'bg-transparent rounded-none',
              'placeholder:text-gray-400/80',
              'dark:placeholder:text-gray-700',
              'focus:outline-hidden',
              isPending && 'opacity-20',
            )}
            placeholder={appText.cmdk.placeholder}
            disabled={isPending}
          />
          {isLoading && !isPending
            ? <span className="mr-1 translate-y-[2px]">
              <Spinner size={16} />
            </span>
            : <span className="max-sm:hidden">
              <LoaderButton
                className={clsx(
                  'h-auto! px-1.5 py-1 -mr-1.5',
                  'border-medium shadow-none',
                  'text-[12px]',
                  'text-gray-400/90 dark:text-gray-700',
                )}
                onClick={() => setIsOpen?.(false)}
              >
                ESC
              </LoaderButton>
            </span>}
        </div>
        <Command.List
          ref={refScroll}
          onScroll={updateMask}
          className="overflow-y-auto"
          style={{ ...styleMask, maxHeight }}
        >
          <div className="flex flex-col pt-2 pb-3 px-3 gap-2">
            <Command.Empty className="mt-1 px-2 text-dim text-[0.9rem] pb-0.5">
              {isLoading
                ? appText.cmdk.searching
                : appText.cmdk.noResults}
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
                    'px-2 py-1',
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
                            startTransition(() => router.push(path));
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
