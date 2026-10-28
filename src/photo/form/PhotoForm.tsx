/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import {
  ComponentProps,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FIELDS_TO_NOT_TOAST,
  FIELDS_WITH_JSON,
  FORM_METADATA_ENTRIES_BY_SECTION,
  FORM_SECTIONS,
  FormFields,
  FormMeta,
  PhotoFormData,
  convertFormKeysToLabels,
  getChangedFormFields,
  getFormErrors,
  isFormValid,
  formDataWithUpdatedColorData,
  formDataWithUpdatedKeyColor,
  formDataWithSyncedTakenAt,
  getTakenAtOffsetMsForForm,
} from '.';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import Checkbox from '@/components/Checkbox';
import {
  createPhotoAction,
  getAiColorAction,
  updatePhotoAction,
} from '../actions';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import {
  PARAM_REDIRECT,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_UPLOADS,
} from '@/app/path';
import { toastSuccess, toastWarning } from '@/toast';
import { getDimensionsFromSize } from '@/utility/size';
import ImageWithFallback from '@/components/image/ImageWithFallback';
import { Tags, convertTagsForForm } from '@/tag';
import { AiContent } from '../ai/useAiImageQueries';
import AiButton from '../ai/AiButton';
import { HiSparkles } from 'react-icons/hi';
import LoaderButton from '@/components/primitives/LoaderButton';
import Spinner from '@/components/Spinner';
import usePreventNavigation from '@/utility/usePreventNavigation';
import { useAppState } from '@/app/AppState';
import UpdateBlurDataButton from '../UpdateBlurDataButton';
import { BLUR_ENABLED, IS_PREVIEW } from '@/app/config';
import PlaceInput from '@/place/PlaceInput';
import { convertPlaceToAutocomplete, Place } from '@/place';
import ErrorNote from '@/components/ErrorNote';
import { convertRecipesForForm, Recipes } from '@/recipe';
import deepEqual from 'fast-deep-equal/es6/react';
import ApplyRecipeTitleGloballyCheckbox from './ApplyRecipesGloballyCheckbox';
import FieldsetRecipeData from './FieldsetRecipeData';
import { convertFilmsForForm, Films } from '@/film';
import {
  Cameras,
  convertCameraMakesForForm,
  convertCameraModelsForForm,
} from '@/camera';
import {
  Lenses,
  convertLensMakesForForm,
  convertLensModelsForForm,
} from '@/lens';
import { isMakeFujifilm } from '@/platforms/fujifilm';
import PhotoFilmIcon from '@/film/PhotoFilmIcon';
import FieldsetFavs from './FieldsetFavs';
import { useAppText } from '@/i18n/state/client';
import IconAddUpload from '@/components/icons/IconAddUpload';
import { didVisibilityChange } from '../visibility';
import FieldsetVisibility from '../visibility/FieldsetVisibility';
import PhotoColors from '../color/PhotoColors';
import ColorDot from '../color/ColorDot';
import {
  convertJsonStringToOklch,
  convertOklchToJsonString,
  generateColorDataFromString,
  getKeyColorFromColorData,
} from '../color/client';
import { capitalize } from '@/utility/string';
import AnchorSections from '@/components/AnchorSections';
import useIsVisible from '@/utility/useIsVisible';
import useHash from '@/utility/useHash';
import useMediaQuery from '@/utility/useMediaQuery';
import {
  LAYOUT_CLASS_MAIN,
  LAYOUT_CLASS_SHELL_X,
  LAYOUT_MAIN,
} from '@/app/layout-metrics';
import { getOptimizedPhotoUrlForManipulation } from '../storage';
import {
  getFileNamePartsFromStorageUrl,
  StorageListResponse,
} from '@/platforms/storage';
import SmallDisclosure from '@/components/SmallDisclosure';
import { TbPhoto } from 'react-icons/tb';
import { Albums } from '@/album';
import FieldsetAlbum from '@/album/FieldsetAlbum';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';
import DateTimePicker from '@/components/DateTimePicker';

const THUMBNAIL_SIZE = 300;
/** Form cap. The floating thumb is placed to the right of this. */
const FORM_MAX_WIDTH_PX = 38 * 16;
/**
 * The floating thumb used to sit 3rem from the form. Most of that gap is
 * now thumb size (more than half); 1rem remains so the two don't touch.
 */
const FORM_THUMB_GAP_PX = 16;
const FLOATING_THUMB_SIZE = THUMBNAIL_SIZE + (3 * 16 - FORM_THUMB_GAP_PX);
/** Resting offset from the viewport top (`top-8`). */
const FLOATING_THUMB_TOP_PX = 32;
/** Entrance rise (`-translate-y-4`), kept inside the clip box. */
const FLOATING_THUMB_RISE_PX = 16;

export default function PhotoForm({
  type = 'create',
  initialPhotoForm,
  photoStorageUrls = [],
  updatedExifData,
  updatedBlurData,
  photoAlbumTitles = [],
  albums,
  uniqueTags,
  uniqueRecipes,
  uniqueFilms,
  uniqueCameras,
  uniqueLenses,
  aiContent,
  shouldStripGpsData,
  hasLocationServices,
  onTitleChange,
  onFormDataChange,
  onFormStatusChange,
}: {
  type?: 'create' | 'edit'
  initialPhotoForm: Partial<PhotoFormData>
  photoStorageUrls?: StorageListResponse
  updatedExifData?: Partial<PhotoFormData>
  updatedBlurData?: string
  photoAlbumTitles?: string[]
  albums: Albums
  uniqueTags: Tags
  uniqueRecipes: Recipes
  uniqueFilms: Films
  uniqueCameras?: Cameras
  uniqueLenses?: Lenses
  aiContent?: AiContent
  shouldStripGpsData?: boolean
  hasLocationServices?: boolean
  onTitleChange?: (updatedTitle: string) => void
  onFormDataChange?: (formData: Partial<PhotoFormData>) => void,
  onFormStatusChange?: (pending: boolean) => void
}) {
  const redirectParam = useSearchParams().get(PARAM_REDIRECT);

  const [formData, setFormData] =
    useState<Partial<PhotoFormData>>(initialPhotoForm);
  const [formErrors, setFormErrors] =
    useState(getFormErrors(initialPhotoForm));
  const [formActionErrorMessage, setFormActionErrorMessage] = useState('');

  // Last known timezone offset between taken-at fields,
  // remembered so partially typed dates still sync once valid
  const [takenAtOffsetMs, setTakenAtOffsetMs] = useState(() =>
    getTakenAtOffsetMsForForm(initialPhotoForm));
  const [shouldSyncTakenAt, setShouldSyncTakenAt] = useState(true);
  const canSyncTakenAt = takenAtOffsetMs !== undefined;

  const [detectedFilm, setDetectedFilm] =
    useState(initialPhotoForm.film);

  const [albumTitles, setAlbumTitles] = useState(photoAlbumTitles
    .sort((a, b) => a.localeCompare(b))
    .join(','));
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);
  const [isLoadingKeyColor, setIsLoadingKeyColor] = useState(false);

  const areAlbumTitlesModified = albumTitles !== photoAlbumTitles
    .sort((a, b) => a.localeCompare(b))
    .join(',');

  const { hash } = useHash();

  const { invalidateSwr, shouldDebugImageFallbacks } = useAppState();

  const appText = useAppText();

  const changedFormKeys = useMemo(() =>
    getChangedFormFields(initialPhotoForm, formData),
  [initialPhotoForm, formData]);
  const formHasChanged = changedFormKeys.length > 0 || areAlbumTitlesModified;
  const onlyChangedFieldIsBlurData =
    changedFormKeys.length === 1 &&
    changedFormKeys[0] === 'blurData';

  usePreventNavigation(formHasChanged && !onlyChangedFieldIsBlurData);

  const canFormBeSubmitted =
    (type === 'create' || formHasChanged) &&
    isFormValid(formData) &&
    !aiContent?.isLoading &&
    !isLoadingKeyColor;

  // Update form when EXIF data
  // is refreshed by parent
  useEffect(() => {
    if (Object.keys(updatedExifData ?? {}).length > 0) {
      const changedKeys: (keyof PhotoFormData)[] = [];

      setFormData(currentForm => {
        (Object.entries(updatedExifData ?? {}) as
          [keyof PhotoFormData, string][])
          .forEach(([key, value]) => {
            let a = currentForm[key];
            let b = value;
            if (FIELDS_WITH_JSON.includes(key)) {
              try {
                a = a ? JSON.parse(a) : undefined;
                b = b ? JSON.parse(b) : undefined;
              } catch (error) {
                console.log(`Error parsing JSON: ${key}`, error);
              }
            }
            if (!deepEqual(a, b)) {
              changedKeys.push(key as keyof PhotoFormData);
            }
          });

        const colorData = generateColorDataFromString(
          updatedExifData?.colorData,
        );
        const keyColor = convertOklchToJsonString(
          getKeyColorFromColorData(colorData),
        );

        return {
          ...currentForm,
          ...updatedExifData,
          ...updatedExifData?.colorData !== undefined && { keyColor },
        };
      });

      if (updatedExifData?.film) {
        setDetectedFilm(updatedExifData.film);
      }

      const keysToToast = changedKeys.filter(key =>
        !FIELDS_TO_NOT_TOAST.includes(key));
      if (keysToToast.length > 0) {
        const fields = convertFormKeysToLabels(keysToToast);
        toastSuccess(`Updated EXIF fields: ${fields.join(', ')}`, 8000);
      } else {
        toastWarning('No new EXIF data found');
      }
    }
  }, [updatedExifData]);

  const url = formData.url ?? '';

  const regenerateKeyColor = useCallback(async () => {
    if (!url) { return; }
    setIsLoadingKeyColor(true);
    try {
      const ai = await getAiColorAction(url);
      if (ai) {
        setFormData(data => formDataWithUpdatedKeyColor(
          data,
          convertOklchToJsonString(ai),
        ));
      } else {
        toastWarning('Could not generate key color');
      }
    } catch (error: any) {
      toastWarning(error.message || 'Could not generate key color');
    } finally {
      setIsLoadingKeyColor(false);
    }
  }, [url]);

  useEffect(() => {
    if (updatedBlurData) {
      setFormData(data => updatedBlurData
        ? { ...data, blurData: updatedBlurData }
        : data);
    } else if (!BLUR_ENABLED) {
      setFormData(data => ({ ...data, blurData: '' }));
    }
  }, [updatedBlurData]);

  useEffect(() =>
    setFormData(data => aiContent?.title
      ? { ...data, title: aiContent?.title }
      : data),
  [aiContent?.title]);

  useEffect(() =>
    setFormData(data => aiContent?.caption
      ? { ...data, caption: aiContent?.caption }
      : data),
  [aiContent?.caption]);

  useEffect(() =>
    setFormData(data => aiContent?.tags
      ? { ...data, tags: aiContent?.tags }
      : data),
  [aiContent?.tags]);

  useEffect(() =>
    setFormData(data => aiContent?.semanticDescription
      ? { ...data, semanticDescription: aiContent?.semanticDescription }
      : data),
  [aiContent?.semanticDescription]);

  useEffect(() => {
    onFormDataChange?.(formData);
  }, [onFormDataChange, formData]);

  const isFieldGeneratingAi = (key: keyof PhotoFormData) => {
    switch (key) {
      case 'title':
        return aiContent?.isLoadingTitle;
      case 'caption':
        return aiContent?.isLoadingCaption;
      case 'tags':
        return aiContent?.isLoadingTags;
      case 'semanticDescription':
        return aiContent?.isLoadingSemantic;
      case 'keyColor':
        return isLoadingKeyColor;
      default:
        return false;
    }
  };

  const accessoryForField = (key: keyof PhotoFormData) => {
    if (aiContent) {
      switch (key) {
        case 'title':
          return <AiButton
            tabIndex={-1}
            aiContent={aiContent}
            requestFields={['title']}
            shouldConfirm={Boolean(formData.title)}
            className="h-full"
          />;
        case 'caption':
          return <AiButton
            tabIndex={-1}
            aiContent={aiContent}
            requestFields={['caption']}
            shouldConfirm={Boolean(formData.caption)}
            className="h-full"
          />;
        case 'tags':
          return <AiButton
            tabIndex={-1}
            aiContent={aiContent}
            requestFields={['tags']}
            shouldConfirm={Boolean(formData.tags)}
            className="h-full"
          />;
        case 'semanticDescription':
          return <AiButton
            tabIndex={-1}
            aiContent={aiContent}
            requestFields={['semantic']}
            shouldConfirm={Boolean(formData.semanticDescription)}
          />;
        case 'keyColor':
          return <LoaderButton
            tabIndex={-1}
            icon={<HiSparkles size={16} />}
            className="h-full"
            isLoading={isLoadingKeyColor}
            onClick={() => {
              if (
                !formData.keyColor ||
                confirm('Are you sure you want to overwrite existing content?')
              ) {
                regenerateKeyColor();
              }
            }}
          />;
        case 'blurData':
          return shouldDebugImageFallbacks && type === 'edit' && formData.url
            ? <UpdateBlurDataButton
              photoUrl={getOptimizedPhotoUrlForManipulation(
                formData.url,
                IS_PREVIEW,
              )}
              onUpdatedBlurData={blurData =>
                setFormData(data => ({ ...data, blurData }))}
            />
            : null;
      }
    }
  };

  const footerForField = (key: keyof PhotoFormData) => {
    switch (key) {
      case 'url':
        return type === 'edit' && photoStorageUrls.length === 0
          ? <span className="text-error">
            No storage found for photo
          </span>
          : photoStorageUrls.length > 1
            ? <SmallDisclosure label="Optimized file set">
              <div className="space-y-1">
                {photoStorageUrls.map(({ url, size }) => {
                  const {
                    fileName,
                    fileModifier,
                  } = getFileNamePartsFromStorageUrl(url);
                  return <div
                    key={url}
                    className="flex items-center gap-2"
                  >
                    <TbPhoto className="translate-y-[1px] text-medium" />
                    <Link
                      href={url}
                      target="_blank"
                    >
                      {fileName}
                    </Link>
                    <span className="text-dim">
                      {size}
                      {/* Show dimensions for original file when available */}
                      {!fileModifier && formData.width && formData.height &&
                        ` @ ${formData.width}×${formData.height}`}
                    </span>
                  </div>;
                })}
              </div>
            </SmallDisclosure>
            : null;
    }
  };

  const isFieldHidden = (
    key: FormFields,
    hideIfEmpty?: boolean,
    shouldHide?: FormMeta['shouldHide'],
  ) => {
    if (
      key === 'blurData' &&
      type === 'create' &&
      !BLUR_ENABLED &&
      !shouldDebugImageFallbacks
    ) {
      return true;
    } else if (
      hasLocationServices &&
      (key === 'location' || key === 'locationDisplayName') &&
      !formData.location &&
      !isLoadingPlace
    ) {
      return true;
    } else {
      return (
        (hideIfEmpty && !formData[key]) ||
        shouldHide?.(formData, changedFormKeys)
      );
    }
  };

  const onMatchResults = useCallback((didFindMatchingPhotos: boolean) => {
    setFormData(data => ({
      ...data,
      applyRecipeTitleGlobally: didFindMatchingPhotos
        ? 'true'
        : 'false',
    }));
  }, [setFormData]);

  // Recipe data copied in from a chosen title can be replaced by subsequent
  // titles, and is never used to search for photos needing that title
  const [copiedRecipeData, setCopiedRecipeData] = useState<string>();

  const initialPlace = useMemo(() => {
    try {
      return convertPlaceToAutocomplete(
        initialPhotoForm.location
          ? JSON.parse(initialPhotoForm.location) as Place
          : undefined,
      );
    } catch {
      return undefined;
    }
  }, [initialPhotoForm.location]);

  const setPlace = useCallback((place?: Place) => {
    setFormData(data => ({
      ...data,
      location: place ? JSON.stringify(place) : '',
      locationDisplayName: place?.nameFormatted ?? place?.name ?? '',
    }));
  }, []);

  const didCopyRecipeData =
    Boolean(formData.recipeData) &&
    formData.recipeData === copiedRecipeData;

  const onRecipeDataFound = useCallback((recipeData: string) => {
    setCopiedRecipeData(recipeData);
    setFormData(data => ({ ...data, recipeData }));
  }, [setFormData]);

  const formContent = useMemo(() =>
    FORM_METADATA_ENTRIES_BY_SECTION(
      convertTagsForForm(uniqueTags, appText),
      convertRecipesForForm(uniqueRecipes),
      convertFilmsForForm(
        uniqueFilms,
        isMakeFujifilm(formData.make),
        detectedFilm,
        formData.make,
      ),
      convertCameraMakesForForm(uniqueCameras),
      convertCameraModelsForForm(uniqueCameras),
      convertLensMakesForForm(uniqueLenses),
      convertLensModelsForForm(uniqueLenses),
      aiContent !== undefined,
      shouldStripGpsData,
      hasLocationServices,
    ), [
    uniqueTags,
    appText,
    uniqueRecipes,
    uniqueFilms,
    uniqueCameras,
    uniqueLenses,
    formData.make,
    detectedFilm,
    aiContent,
    shouldStripGpsData,
    hasLocationServices,
  ]);

  const ref = useRef<HTMLImageElement>(null);
  const isThumbnailVisible = useIsVisible({ ref, initiallyVisible: true });
  const thumbnailDimensions =
    getDimensionsFromSize(THUMBNAIL_SIZE, formData.aspectRatio);
  const floatingThumbDimensions =
    getDimensionsFromSize(FLOATING_THUMB_SIZE, formData.aspectRatio);
  // Stay visible once the viewport is wider than the main column.
  // Narrower than that, the shell has no side margin to hold it.
  const canFloatThumb = useMediaQuery(`(min-width: ${LAYOUT_MAIN}px)`);
  const thumbnail = (
    includeRef?: boolean,
    className?: string,
    dimensions = thumbnailDimensions,
  ) =>
    <ImageWithFallback
      ref={includeRef ? ref : undefined}
      alt={formData.title || 'Photo thumbnail'}
      src={url}
      className={clsx(
        'border rounded-md overflow-hidden',
        'border-gray-200 dark:border-gray-700',
        className,
      )}
      blurDataURL={formData.blurData}
      blurCompatibilityLevel="none"
      width={dimensions.width}
      height={dimensions.height}
      loading="eager"
    />;

  return (
    <div className="space-y-4 max-w-[38rem]">
      <div className="relative flex gap-2">
        {thumbnail(true)}
        {canFloatThumb &&
          <div
            className={clsx(
              // Match the page shell and centered main column so the thumb
              // stays in the margin beside the form. Clip at the shell edge
              // instead of unmounting while part of the thumb still fits.
              'fixed z-10 inset-x-0 overflow-clip',
              'pointer-events-none',
              LAYOUT_CLASS_SHELL_X,
            )}
            style={{
              top: FLOATING_THUMB_TOP_PX - FLOATING_THUMB_RISE_PX,
              height: floatingThumbDimensions.height +
                FLOATING_THUMB_RISE_PX + 2,
              paddingTop: FLOATING_THUMB_RISE_PX,
            }}
          >
            <div className={clsx(
              'relative mx-auto w-full',
              LAYOUT_CLASS_MAIN,
            )}>
              <div
                className="absolute top-0"
                style={{ left: FORM_MAX_WIDTH_PX + FORM_THUMB_GAP_PX }}
              >
                {thumbnail(false, clsx(
                  'opacity-0 -translate-y-4',
                  !isThumbnailVisible &&
                    'opacity-100 translate-y-0 transition-all duration-300',
                ), floatingThumbDimensions)}
              </div>
            </div>
          </div>}
        <div className={clsx(
          'absolute top-2 left-2 transition-opacity duration-500',
          aiContent?.isLoading ? 'opacity-100' : 'opacity-0',
        )}>
          <div className={clsx(
            'leading-none text-xs font-medium uppercase tracking-wide',
            'px-1.5 py-1 rounded-[4px]',
            'inline-flex items-center gap-2',
            'bg-white/70 dark:bg-black/60 backdrop-blur-md',
            'border border-gray-900/10 dark:border-gray-700/70',
            'select-none',
          )}>
            <Spinner
              color="text"
              size={9}
              className={clsx(
                'text-extra-dim',
                'translate-x-[1px] translate-y-[0.5px]',
              )}
            />
            Analyzing image
          </div>
        </div>
      </div>
      {formActionErrorMessage &&
        <ErrorNote>{formActionErrorMessage}</ErrorNote>}
      <div className={clsx(
        'flex gap-4',
        'sticky top-0 z-10 bg-main',
        'border-b border-gray-200 dark:border-gray-700',
        'uppercase tracking-wide text-sm',
        '*:py-2',
      )}>
        <span className="flex gap-4 max-sm:hidden">
          <span>Photo Details</span>
          <span className="text-extra-extra-dim">/</span>
        </span>
        {FORM_SECTIONS.map(section => (
          <a
            key={section}
            href={`#${section}`}
            className={clsx(
              'cursor-pointer hover:text-main',
              'active:border-b-2',
              'active:border-b-gray-200 dark:active:border-b-gray-700',
              section === hash
                ? 'font-bold border-b-2 border-b-black dark:border-b-white'
                : 'text-dim',
            )}
          >
            {capitalize(section)}
          </a>
        ))}
      </div>
      <Form
        action={data => (type === 'create'
          ? createPhotoAction
          : updatePhotoAction
        )(data, redirectParam ?? PATH_ADMIN_PHOTOS)
          .catch(e => {
            if (e.message !== 'NEXT_REDIRECT') {
              setFormActionErrorMessage(e.message);
            }
          })}
        onSubmit={() => {
          setFormActionErrorMessage('');
          (document.activeElement as HTMLElement)?.blur?.();
          invalidateSwr?.();
        }}
      >
        {/* Fields */}
        <AnchorSections
          className="mt-6 space-y-5 *:space-y-5"
          classNameSection="scroll-mt-12"
          sections={formContent
            .map(({ section, fields }) => ({
              id: section,
              content: <>
                {fields.map(([key, {
                  label,
                  note,
                  noteShort,
                  required,
                  selectOptions,
                  selectOptionsDefaultLabel,
                  tagOptions,
                  tagOptionsLimit,
                  tagOptionsLimitValidationMessage,
                  tagOptionsShouldParameterize,
                  tagOptionsShouldRevealRawText,
                  readOnly,
                  hideModificationStatus,
                  validate,
                  validateStringMaxLength,
                  spellCheck,
                  capitalize,
                  hideIfEmpty,
                  shouldHide,
                  loadingMessage,
                  type,
                  staticValue,
                }]) => {
                  if (!isFieldHidden(key, hideIfEmpty, shouldHide)) {
                    // eslint-disable-next-line @stylistic/max-len
                    const fieldProps: ComponentProps<typeof FieldsetWithStatus> = {
                      id: key,
                      label: label + (
                        key === 'blurData' && shouldDebugImageFallbacks
                          ? ` (${(formData[key] ?? '').length} chars.)`
                          : ''
                      ),
                      note,
                      noteShort,
                      error: formErrors[key],
                      value: staticValue ?? formData[key] ?? '',
                      isModified: (
                        !hideModificationStatus &&
                        changedFormKeys.includes(key)
                      ),
                      onChange: value => {
                        let formUpdated = { ...formData, [key]: value };
                        let syncedErrors: Partial<typeof formErrors> = {};
                        if (key === 'takenAt' || key === 'takenAtNaive') {
                          formUpdated = formDataWithSyncedTakenAt(
                            formData,
                            key,
                            value,
                            shouldSyncTakenAt ? takenAtOffsetMs : undefined,
                          );
                          setTakenAtOffsetMs(getTakenAtOffsetMsForForm(
                            formUpdated,
                            takenAtOffsetMs,
                          ));
                          const keySynced = key === 'takenAt'
                            ? 'takenAtNaive'
                            : 'takenAt';
                          if (formUpdated[keySynced] !== formData[keySynced]) {
                            syncedErrors = { [keySynced]: undefined };
                          }
                        }
                        setFormData(formUpdated);
                        if (validate) {
                          setFormErrors({
                            ...formErrors,
                            ...syncedErrors,
                            [key]: validate(value),
                          });
                        } else if (validateStringMaxLength !== undefined) {
                          setFormErrors({
                            ...formErrors,
                            [key]: value.length > validateStringMaxLength
                              ? `${validateStringMaxLength} characters or less`
                              : undefined,
                          });
                        }
                        if (key === 'title') {
                          onTitleChange?.(value.trim());
                        }
                      },
                      selectOptions,
                      selectOptionsDefaultLabel: selectOptionsDefaultLabel,
                      tagOptions,
                      tagOptionsLimit,
                      tagOptionsLimitValidationMessage,
                      tagOptionsShouldParameterize,
                      tagOptionsShouldRevealRawText,
                      required,
                      readOnly,
                      spellCheck,
                      capitalize,
                      placeholder: loadingMessage && !formData[key]
                        ? loadingMessage
                        : undefined,
                      loading: (
                        (loadingMessage && !formData[key] ? true : false) ||
                        isFieldGeneratingAi(key)
                      ),
                      type,
                      accessory: accessoryForField(key),
                      footer: footerForField(key),
                    };
                    switch (key) {
                      case 'locationPlace':
                        return <PlaceInput
                          key={key}
                          initialPlace={initialPlace}
                          setPlace={setPlace}
                          setIsLoadingPlace={setIsLoadingPlace}
                          className="relative z-1"
                        />;
                      case 'locationDisplayName':
                        return <FieldsetWithStatus
                          key={key}
                          {...fieldProps}
                          value={formData.locationDisplayName ?? ''}
                          readOnly={isLoadingPlace}
                          onChange={value => setFormData(data => {
                            let location = data.location;
                            try {
                              const parsed = location
                                ? JSON.parse(location) as Place
                                : undefined;
                              if (parsed) {
                                location = JSON.stringify({
                                  ...parsed,
                                  nameFormatted: value,
                                });
                              }
                            } catch {
                              // Keep existing location JSON
                            }
                            return {
                              ...data,
                              locationDisplayName: value,
                              location,
                            };
                          })}
                        />;
                      case 'film':
                        return <FieldsetWithStatus
                          key={key}
                          {...fieldProps}
                          tagOptionsDefaultIcon={<span
                            className="w-4 overflow-hidden"
                          >
                            <PhotoFilmIcon />
                          </span>}
                        />;
                      case 'applyRecipeTitleGlobally':
                        return <ApplyRecipeTitleGloballyCheckbox
                          key={key}
                          {...fieldProps}
                          photoId={initialPhotoForm.id}
                          recipeTitle={formData.recipeTitle}
                          hasRecipeTitleChanged={
                            changedFormKeys.includes('recipeTitle')}
                          recipeData={formData.recipeData}
                          film={formData.film}
                          didCopyRecipeData={didCopyRecipeData}
                          onMatchResults={onMatchResults}
                        />;
                      case 'recipeData':
                        return <FieldsetRecipeData
                          key={key}
                          {...fieldProps}
                          recipeTitle={formData.recipeTitle}
                          didCopyRecipeData={didCopyRecipeData}
                          onRecipeDataFound={onRecipeDataFound}
                        />;
                      case 'colorData':
                        return <FieldsetWithStatus
                          key={key}
                          {...fieldProps}
                          noteComplex={<PhotoColors
                            classNameDot="size-[13px]!"
                            // eslint-disable-next-line @stylistic/max-len
                            colorData={generateColorDataFromString(formData.colorData)}
                          />}
                          onChange={value => {
                            const formUpdated = formDataWithUpdatedColorData(
                              formData,
                              value,
                            );
                            setFormData(formUpdated);
                          }}
                        />;
                      case 'keyColor': {
                        const keyColorOklch =
                          convertJsonStringToOklch(formData.keyColor) ??
                          generateColorDataFromString(
                            formData.colorData,
                          )?.ai;
                        return <FieldsetWithStatus
                          key={key}
                          {...fieldProps}
                          noteComplex={keyColorOklch &&
                            <ColorDot
                              className="size-[13px]!"
                              color={keyColorOklch}
                            />}
                          onChange={value => {
                            const formUpdated = formDataWithUpdatedKeyColor(
                              formData,
                              value,
                            );
                            setFormData(formUpdated);
                            if (validate) {
                              setFormErrors({
                                ...formErrors,
                                [key]: validate(value),
                              });
                            }
                          }}
                        />;
                      }
                      case 'tags':
                        return <FieldsetWithStatus
                          key={key}
                          {...fieldProps}
                          className="relative z-3"
                        />;
                      case 'albums':
                        return <FieldsetAlbum
                          key={key}
                          {...fieldProps}
                          albumOptions={albums}
                          value={albumTitles}
                          onChange={value => setAlbumTitles(value)}
                          isModified={areAlbumTitlesModified}
                          className={clsx(
                            fieldProps.className,
                            'relative z-1',
                          )}
                        />;
                      case 'visibility':
                        return <FieldsetVisibility
                          key={key}
                          {...fieldProps}
                          formData={formData}
                          setFormData={setFormData}
                          isModified={didVisibilityChange(
                            initialPhotoForm,
                            formData,
                          )}
                          className="relative z-2"
                        />;
                      case 'takenAt':
                        return <Fragment key={key}>
                          <label className={clsx(
                            'flex items-center gap-2 select-none',
                            canSyncTakenAt
                              ? 'cursor-pointer'
                              : 'cursor-not-allowed',
                          )}>
                            <Checkbox
                              checked={canSyncTakenAt && shouldSyncTakenAt}
                              disabled={!canSyncTakenAt}
                              readOnly={!canSyncTakenAt}
                              onChange={e =>
                                setShouldSyncTakenAt(e.target.checked)}
                            />
                            <span className={clsx(
                              !canSyncTakenAt && 'opacity-50',
                            )}>
                              Keep taken at fields in sync
                            </span>
                            {!canSyncTakenAt &&
                              <span className={clsx(
                                'text-gray-400 dark:text-gray-600',
                              )}>
                                (fields are inconsistent)
                              </span>}
                          </label>
                          <FieldsetWithStatus
                            {...fieldProps}
                            accessory={<DateTimePicker
                              value={formData.takenAt ?? ''}
                              onChange={fieldProps.onChange}
                              type="utc"
                              readOnly={fieldProps.readOnly}
                            />}
                          />
                        </Fragment>;
                      case 'takenAtNaive':
                        return <FieldsetWithStatus
                          key={key}
                          {...fieldProps}
                          accessory={<DateTimePicker
                            value={formData.takenAtNaive ?? ''}
                            onChange={fieldProps.onChange}
                            type="naive"
                            readOnly={fieldProps.readOnly}
                          />}
                        />;
                      case 'favorite':
                        return <FieldsetFavs
                          key={key}
                          {...fieldProps}
                        />;
                      default:
                        return <FieldsetWithStatus
                          key={key}
                          {...fieldProps}
                        />;
                    }
                  }
                })}
              </>,
            }))}
        />
        {/* Actions */}
        <div className={clsx(
          'flex gap-3 sticky bottom-0',
          'pb-4 md:pb-8 mt-16',
          'relative z-10',
        )}>
          <Link
            className="button"
            href={type === 'edit' ? PATH_ADMIN_PHOTOS : PATH_ADMIN_UPLOADS}
          >
            Cancel
          </Link>
          <SubmitButtonWithStatus
            icon={type === 'create' && <IconAddUpload />}
            disabled={!canFormBeSubmitted}
            onFormStatusChange={onFormStatusChange}
            hideText="never"
            primary
          >
            {type === 'create' ? 'Add' : 'Update'}
          </SubmitButtonWithStatus>
          <div className={clsx(
            'absolute -top-16 -left-2 right-0 bottom-0 -z-10',
            'pointer-events-none',
            'bg-linear-to-t',
            'from-white/90 from-60%',
            'dark:from-black/90 dark:from-50%',
          )} />
        </div>
      </Form>
    </div>
  );
};
