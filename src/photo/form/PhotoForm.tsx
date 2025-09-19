'use client';

import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
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
} from '.';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { createPhotoAction, updatePhotoAction } from '../actions';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import { PATH_ADMIN_PHOTOS, PATH_ADMIN_UPLOADS } from '@/app/path';
import { toastSuccess, toastWarning } from '@/toast';
import { getDimensionsFromSize } from '@/utility/size';
import ImageWithFallback from '@/components/image/ImageWithFallback';
import { Tags, convertTagsForForm } from '@/tag';
import { AiContent } from '../ai/useAiImageQueries';
import AiButton from '../ai/AiButton';
import Spinner from '@/components/Spinner';
import usePreventNavigation from '@/utility/usePreventNavigation';
import { useAppState } from '@/app/AppState';
import UpdateBlurDataButton from '../UpdateBlurDataButton';
import { BLUR_ENABLED, IS_PREVIEW } from '@/app/config';
import ErrorNote from '@/components/ErrorNote';
import { convertRecipesForForm, Recipes } from '@/recipe';
import deepEqual from 'fast-deep-equal/es6/react';
import ApplyRecipeTitleGloballyCheckbox from './ApplyRecipesGloballyCheckbox';
import { convertFilmsForForm, Films } from '@/film';
import { isMakeFujifilm } from '@/platforms/fujifilm';
import PhotoFilmIcon from '@/film/PhotoFilmIcon';
import FieldsetFavs from './FieldsetFavs';
import { useAppText } from '@/i18n/state/client';
import IconAddUpload from '@/components/icons/IconAddUpload';
import { didVisibilityChange } from '../visibility';
import FieldsetVisibility from '../visibility/FieldsetVisibility';
import PhotoColors from '../color/PhotoColors';
import { generateColorDataFromString } from '../color/client';
import { capitalize } from '@/utility/string';
import AnchorSections from '@/components/AnchorSections';
import useIsVisible from '@/utility/useIsVisible';
import useHash from '@/utility/useHash';
import { getOptimizedPhotoUrlForManipulation } from '../storage';
import {
  getFileNamePartsFromStorageUrl,
  StorageListResponse,
} from '@/platforms/storage';
import SmallDisclosure from '@/components/SmallDisclosure';
import { TbPhoto } from 'react-icons/tb';
import { Albums } from '@/album';
import FieldsetAlbum from '@/album/FieldsetAlbum';

const THUMBNAIL_SIZE = 300;

export default function PhotoForm({
  type = 'create',
  initialPhotoForm,
  photoStorageUrls,
  updatedExifData,
  updatedBlurData,
  photoAlbumTitles = [],
  albums,
  uniqueTags,
  uniqueRecipes,
  uniqueFilms,
  aiContent,
  shouldStripGpsData,
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
  aiContent?: AiContent
  shouldStripGpsData?: boolean
  onTitleChange?: (updatedTitle: string) => void
  onFormDataChange?: (formData: Partial<PhotoFormData>) => void,
  onFormStatusChange?: (pending: boolean) => void
}) {
  const [formData, setFormData] =
    useState<Partial<PhotoFormData>>(initialPhotoForm);
  const [formErrors, setFormErrors] =
    useState(getFormErrors(initialPhotoForm));
  const [formActionErrorMessage, setFormActionErrorMessage] = useState('');

  const [albumTitles, setAlbumTitles] = useState(photoAlbumTitles
    .sort((a, b) => a.localeCompare(b))
    .join(','));

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
    !aiContent?.isLoading;

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

        return {
          ...currentForm,
          ...updatedExifData,
        };
      });

      if (changedKeys.length > 0) {
        const fields = convertFormKeysToLabels(changedKeys);
        toastSuccess(`Updated EXIF fields: ${fields.join(', ')}`, 8000);
      } else {
        toastWarning('No new EXIF data found');
      }
    }
  }, [updatedExifData]);

  const url = formData.url ?? '';

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
        return photoStorageUrls && photoStorageUrls.length > 1
          ? <SmallDisclosure label="Optimized file set">
            <div className="space-y-1">
              {photoStorageUrls.map(({ url, size }) => {
                const { fileName } = getFileNamePartsFromStorageUrl(url);
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
                  <span className="text-dim">{size}</span>
                </div>;
              })}
            </div>
          </SmallDisclosure>
          : undefined;
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
  }, []);

  const formContent = useMemo(() =>
    FORM_METADATA_ENTRIES_BY_SECTION(
      convertTagsForForm(uniqueTags, appText),
      convertRecipesForForm(uniqueRecipes),
      convertFilmsForForm(uniqueFilms, isMakeFujifilm(formData.make)),
      aiContent !== undefined,
      shouldStripGpsData,
    ), [
    uniqueTags,
    appText,
    uniqueRecipes,
    uniqueFilms,
    formData.make,
    aiContent,
    shouldStripGpsData,
  ]);

  const ref = useRef<HTMLImageElement>(null);
  const isThumbnailVisible = useIsVisible({ ref, initiallyVisible: true });
  const thumbnailDimensions =
    getDimensionsFromSize(THUMBNAIL_SIZE, formData.aspectRatio);
  const thumbnail = (includeRef?: boolean, className?: string) =>
    <ImageWithFallback
      ref={includeRef ? ref : undefined}
      alt="Upload"
      src={url}
      className={clsx(
        'border rounded-md overflow-hidden',
        'border-gray-200 dark:border-gray-700',
        className,
      )}
      blurDataURL={formData.blurData}
      blurCompatibilityLevel="none"
      width={thumbnailDimensions.width}
      height={thumbnailDimensions.height}
      priority
    />;

  return (
    <div className="space-y-4 max-w-[38rem] relative">
      <div className="flex gap-2">
        <div className="relative">
          {thumbnail(true)}
          <div className={clsx(
            'max-md:hidden',
            'fixed top-8',
            // Orient around responsive form fields
            'left-[77%] min-[850px]:left-[41rem] lg:left-[42rem]',
            'mr-4',
            // Prevent image blocking form button interaction
            'pointer-events-none',
          )}>
            {thumbnail(false, clsx(
              'opacity-0 -translate-y-4',
              !isThumbnailVisible &&
                'opacity-100 translate-y-0 transition-all duration-300',
            ))}
          </div>
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
      <form
        action={data => (type === 'create'
          ? createPhotoAction
          : updatePhotoAction
        )(data)
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
                    // eslint-disable-next-line max-len
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
                        const formUpdated = { ...formData, [key]: value };
                        setFormData(formUpdated);
                        if (validate) {
                          setFormErrors({
                            ...formErrors, [key]:
                            validate(value),
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
                          onMatchResults={onMatchResults}
                        />;
                      case 'colorData':
                        return <FieldsetWithStatus
                          key={key}
                          {...fieldProps}
                          noteComplex={<PhotoColors
                            classNameDot="size-[13px]!"
                            // eslint-disable-next-line max-len
                            colorData={generateColorDataFromString(formData.colorData)}
                          />}
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
      </form>
    </div>
  );
};
