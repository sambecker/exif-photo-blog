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
  PATH_ABOUT,
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
  pathForAlbum,
  pathForCamera,
  pathForFilm,
  pathForFocalLength,
  pathForLens,
  pathForPhoto,
  pathForRecipe,
  pathForTag,
  pathForYear,
  PREFIX_RECENTS,
} from '../app/path';
import Modal from '../components/Modal';
import { clsx } from 'clsx/lite';
import Spinner from '../components/Spinner';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BiDesktop, BiLockAlt, BiMoon, BiSun } from 'react-icons/bi';
import { IoClose, IoInvertModeSharp } from 'react-icons/io5';
import { useAppState } from '@/app/AppState';
import { RiToolsFill } from 'react-icons/ri';
import { signOutAction } from '@/auth/actions';
import { getKeywordsForPhoto, titleForPhoto } from '@/photo';
import PhotoDate from '@/photo/PhotoDate';
import PhotoSmall from '@/photo/PhotoSmall';
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
  COLOR_SORT_ENABLED,
  GRID_HOMEPAGE_ENABLED,
  HIDE_TAGS_WITH_ONE_PHOTO,
  SHOW_ABOUT_PAGE,
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
import useViewportHeight from '@/utility/useViewportHeight';
import useMaskedScroll from '../components/useMaskedScroll';
import { labelForFilm } from '@/film';
import IconFavs from '@/components/icons/IconFavs';
import { useAppText } from '@/i18n/state/client';
import LoaderButton from '@/components/primitives/LoaderButton';
import IconRecents from '@/components/icons/IconRecents';
import { CgClose, CgFileDocument } from 'react-icons/cg';
import { FaRegUserCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import IconCheck from '@/components/icons/IconCheck';
import { getSortStateFromPath } from '@/photo/sort/path';
import IconSort from '@/components/icons/IconSort';
import { useSelectPhotosState } from '@/admin/select/SelectPhotosState';
import IconAlbum from '@/components/icons/IconAlbum';
import usePhotoQuery from '@/photo/usePhotoQuery';

const DIALOG_TITLE = 'Global Command-K Menu';
const DIALOG_DESCRIPTION = 'For searching photos, views, and settings';

const LISTENER_KEYDOWN = 'keydown';

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

const renderCheck = (isChecked?: boolean) =>
  isChecked
    ? <IconCheck size={12} className="translate-y-[-0.5px]" />
    : undefined;

const renderToggle = (
  label: string,
  onToggle?: Dispatch<SetStateAction<boolean>>,
  isEnabled?: boolean,
): CommandKItem => ({
  label: `Toggle ${label}`,
  action: () => onToggle?.(prev => !prev),
  annotation: renderCheck(isEnabled),
});

export default function CommandKClient({
  recents,
  years: _years,
  cameras,
  lenses,
  albums,
  tags: _tags,
  recipes,
  films,
  focalLengths,
  footer,
}: {
  footer?: string
} & PhotoSetCategories) {
  const pathname = usePathname();

  const appText = useAppText();

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

  const {
    isSelectingPhotos,
    startSelectingPhotos,
    stopSelectingPhotos,
  } = useSelectPhotosState();

  const {
    doesPathOfferSort,
    isSortedByDefault,
    isAscending,
    isTakenAt,
    isUploadedAt,
    isColor,
    descendingLabel,
    ascendingLabel,
    pathDescending,
    pathAscending,
    pathTakenAt,
    pathUploadedAt,
    pathColor,
    pathClearSort,
  } = useMemo(
    () => getSortStateFromPath(pathname, appText),
    [pathname, appText],
  );

  const isOpenRef = useRef(isOpen);

  const refInput = useRef<HTMLInputElement>(null);
  const mobileViewportHeight = useViewportHeight();
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

  const [query, setQuery] = useState('');
  const {
    queryFormatted,
    photos,
    isLoading,
    reset,
  } = usePhotoQuery({ query, isEnabled: !isPending });

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

  const queriedSections = useMemo<CommandKSection[]>(() => {
    if (isOpenRef.current && photos.length > 0) {
      return [{
        heading: 'Photos',
        accessory: <IconPhoto size={14} />,
        items: photos.map(photo => ({
          label: titleForPhoto(photo),
          keywords: getKeywordsForPhoto(photo),
          annotation: <PhotoDate {...{ photo, timezone: undefined }} />,
          accessory: <PhotoSmall photo={photo} />,
          path: pathForPhoto({ photo }),
        })),
      }];
    } else {
      return [];
    }
  },    
  [photos],
  );

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      reset();
    }
  }, [isOpen, reset]);

  const recent = recents[0];
  const recentsStatus = useMemo(() => {
    if (!recent) { return undefined; }
    const { count, lastModified } = recent;
    const subhead = appText.category.recentSubhead(
      formatDistanceToNow(lastModified),
    );
    return count ? { count, subhead } : undefined;
  }, [recent, appText]);

  // Years only accessible by search
  const years = useMemo(() =>
    _years.filter(({ year }) => queryFormatted && year.includes(queryFormatted))
  , [_years, queryFormatted]);

  const tags = useMemo(() => {
    const tagsIncludingPrivate = photosCountHidden > 0
      ? addPrivateToTags(_tags, photosCountHidden)
      : _tags;
    return HIDE_TAGS_WITH_ONE_PHOTO
      ? limitTagsByCount(tagsIncludingPrivate, 2, queryFormatted)
      : tagsIncludingPrivate;
  }, [_tags, photosCountHidden, queryFormatted]);

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
          case 'albums': return {
            heading: appText.category.albumPlural,
            accessory: <IconAlbum size={14} />,
            items: albums.map(({ album, count }) => ({
              label: album.title,
              annotation: formatCount(count),
              annotationAria: formatCountDescriptive(count),
              path: pathForAlbum(album),
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
    albums,
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

  const sortItems = [{
    label: descendingLabel,
    path: pathDescending,
    annotation: renderCheck(!isAscending),
  }, {
    label: ascendingLabel,
    path: pathAscending,
    annotation: renderCheck(isAscending),
  }, {
    label: appText.sort.byTakenAt,
    path: pathTakenAt,
    annotation: renderCheck(isTakenAt),
  }, {
    label: appText.sort.byUploadedAt,
    path: pathUploadedAt,
    annotation: renderCheck(isUploadedAt),
  }];

  if (COLOR_SORT_ENABLED) {
    sortItems.push({
      label: appText.sort.byColor,
      path: pathColor,
      annotation: renderCheck(isColor),
    });
  }

  if (!isSortedByDefault) {
    sortItems.push({
      label: appText.sort.clearSort,
      path: pathClearSort,
      annotation: <CgClose />,
    });
  }

  const sortSection: CommandKSection = {
    heading: appText.sort.sort,
    accessory: <IconSort size={14} className="translate-x-[0.5px]" />,
    items: doesPathOfferSort
      ? sortItems
      : [],
  };

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

  if (SHOW_ABOUT_PAGE) {
    pageItems.push({
      label: appText.nav.about,
      path: PATH_ABOUT,
    });
  }

  const sectionPages: CommandKSection = {
    heading: appText.cmdk.pages,
    accessory: <CgFileDocument size={14} className="translate-x-[-0.5px]" />,
    items: pageItems,
  };

  const adminSection: CommandKSection = {
    heading: appText.nav.admin,
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
      label: isSelectingPhotos
        ? appText.admin.selectPhotosExit
        : appText.admin.selectPhotos,
      annotation: <IconLock narrow />,
      // Search by legacy label
      keywords: ['batch', 'edit'],
      action: () => {
        if (!isSelectingPhotos) {
          startSelectingPhotos?.();
        } else {
          stopSelectingPhotos?.();
        }
      },
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
            value={query}
            onValueChange={value => {
              setQuery(value);
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
            ? <span className="translate-y-[2px]">
              <Spinner size={16} className="-mr-1" />
            </span>
            : <span>
              <LoaderButton
                className={clsx(
                  'h-auto! py-1 mr-[-9px]',
                  'px-1',
                  'text-[12px]',
                  'text-gray-400/90 dark:text-gray-700',
                )}
                onClick={() => {
                  if (query) {
                    setQuery('');
                    updateMask();
                  } else {
                    setIsOpen?.(false);
                  }
                }}
              >
                {query
                  ? <IoClose size={17} className="text-dim" />
                  : <>
                    <span className="sm:hidden">
                      <IoClose size={17} className="text-dim" />
                    </span>
                    <span className="max-sm:hidden mx-0.5">
                      ESC
                    </span>
                  </>}
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
              .concat(sortSection)
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
            {footer && !queryFormatted &&
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
