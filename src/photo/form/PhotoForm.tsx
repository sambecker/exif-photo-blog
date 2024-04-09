'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FORM_METADATA_ENTRIES,
  PhotoFormData,
  convertFormKeysToLabels,
  formHasTextContent,
  getChangedFormFields,
  getFormErrors,
  isFormValid,
} from '.';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import { createPhotoAction, updatePhotoAction } from '../actions';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import CanvasBlurCapture from '@/components/CanvasBlurCapture';
import { PATH_ADMIN_PHOTOS, PATH_ADMIN_UPLOADS } from '@/site/paths';
import { toastSuccess, toastWarning } from '@/toast';
import { getDimensionsFromSize } from '@/utility/size';
import ImageBlurFallback from '@/components/ImageBlurFallback';
import { BLUR_ENABLED } from '@/site/config';
import { Tags, sortTagsObjectWithoutFavs } from '@/tag';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import { AiContent } from '../ai/useAiImageQueries';
import AiButton from '../ai/AiButton';
import Spinner from '@/components/Spinner';
import { getNextImageUrlForRequest } from '@/services/next-image';
import useDelay from '@/utility/useDelay';
import usePreventNavigation from '@/utility/usePreventNavigation';

const THUMBNAIL_SIZE = 300;

export default function PhotoForm({
  initialPhotoForm,
  updatedExifData,
  type = 'create',
  uniqueTags,
  aiContent,
  debugBlur,
  onTitleChange,
  onTextContentChange,
  onFormStatusChange,
}: {
  initialPhotoForm: Partial<PhotoFormData>
  updatedExifData?: Partial<PhotoFormData>
  type?: 'create' | 'edit'
  uniqueTags?: Tags
  aiContent?: AiContent
  setImageData?: (imageData: string) => void
  debugBlur?: boolean
  onTitleChange?: (updatedTitle: string) => void
  onTextContentChange?: (hasContent: boolean) => void,
  onFormStatusChange?: (pending: boolean) => void
}) {
  const [formData, setFormData] =
    useState<Partial<PhotoFormData>>(initialPhotoForm);
  const [formErrors, setFormErrors] =
    useState(getFormErrors(initialPhotoForm));
  const [blurError, setBlurError] =
    useState<string>();
  const [hasBlurData, setHasBlurData] = useState(false);

  const changedFormKeys = useMemo(() =>
    getChangedFormFields(initialPhotoForm, formData),
  [initialPhotoForm, formData]);
  const formHasChanged = changedFormKeys.length > 0;
  const onlyChangedFieldIsBlurData =
    changedFormKeys.length === 1 &&
    changedFormKeys[0] === 'blurData';

  usePreventNavigation(formHasChanged && !onlyChangedFieldIsBlurData);

  const canFormBeSubmitted =
    (type === 'create' || formHasChanged) &&
    isFormValid(formData) &&
    !aiContent?.isLoading;
  
  const didLoad1000msAgo = useDelay(1000);

  // Show image loading status when necessary for
  // blur data or AI analysis
  const showImageLoadingStatus =
    !hasBlurData &&
    didLoad1000msAgo && (
      (BLUR_ENABLED && !formData.blurData) ||
      aiContent !== undefined
    );

  // Update form when EXIF data
  // is refreshed by parent
  useEffect(() => {
    if (Object.keys(updatedExifData ?? {}).length > 0) {
      const changedKeys: (keyof PhotoFormData)[] = [];

      setFormData(currentForm => {
        Object.entries(updatedExifData ?? {})
          .forEach(([key, value]) => {
            if (currentForm[key as keyof PhotoFormData] !== value) {
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
        toastSuccess(
          `Updated EXIF fields: ${fields.join(', ')}`,
          8000,
        );
      } else {
        toastWarning('No new EXIF data found');
      }
    }
  }, [updatedExifData]);

  const {
    width,
    height,
  } = getDimensionsFromSize(THUMBNAIL_SIZE, formData.aspectRatio);

  const url = formData.url ?? '';

  const updateBlurData = useCallback((blurData: string) => {
    if (BLUR_ENABLED) {
      setFormData(data => ({
        ...data,
        blurData,
      }));
    }
    setHasBlurData(true);
  }, []);

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
    onTextContentChange?.(formHasTextContent(formData));
  }, [onTextContentChange, formData]);

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

  const aiButtonForField = (key: keyof PhotoFormData) => {
    if (aiContent) {
      switch (key) {
      case 'title':
        return <AiButton
          aiContent={aiContent}
          requestFields={['title']}
          shouldConfirm={Boolean(formData.title)}
          className="h-full"
        />;
      case 'caption':
        return <AiButton
          aiContent={aiContent}
          requestFields={['caption']}
          shouldConfirm={Boolean(formData.caption)}
          className="h-full"
        />;
      case 'tags':
        return <AiButton
          aiContent={aiContent}
          requestFields={['tags']}
          shouldConfirm={Boolean(formData.tags)}
          className="h-full"
        />;
      case 'semanticDescription':
        return <AiButton
          aiContent={aiContent}
          requestFields={['semantic']}
          shouldConfirm={Boolean(formData.semanticDescription)}
        />;
      }
    }
  };

  return (
    <div className="space-y-8 max-w-[38rem] relative">
      {debugBlur && blurError &&
        <div className="border error text-error rounded-md px-2 py-1">
          {blurError}
        </div>}
      <div className="flex gap-2">
        <div className="relative">
          <ImageBlurFallback
            alt="Upload"
            src={url}
            className={clsx(
              'border rounded-md overflow-hidden',
              'border-gray-200 dark:border-gray-700',
            )}
            width={width}
            height={height}
            priority
          />
          <div className={clsx(
            'absolute top-2 left-2 transition-opacity duration-500',
            showImageLoadingStatus ? 'opacity-100' : 'opacity-0',
          )}>
            <div className={clsx(
              'leading-none text-xs font-medium uppercase tracking-wide',
              'px-1.5 py-1 rounded-[4px]',
              'inline-flex items-center gap-2',
              'bg-white/70 dark:bg-black/60 backdrop-blur-md',
              'border border-gray-900/10 dark:border-gray-700/70',
            )}>
              <Spinner
                color="text"
                size={9}
                className={clsx(
                  'text-extra-dim',
                  'translate-x-[1px] translate-y-[0.5px]'
                )}
              />
              Analyzing image
            </div>
          </div>
        </div>
        <CanvasBlurCapture
          imageUrl={getNextImageUrlForRequest(url, 640)}
          width={width}
          height={height}
          onLoad={aiContent?.setImageData}
          onCapture={updateBlurData}
          onError={setBlurError}
        />
        {debugBlur && formData.blurData &&
          <img
            alt="blur"
            src={formData.blurData}
            className={clsx(
              'border rounded-md overflow-hidden',
              'border-gray-200 dark:border-gray-700'
            )}
            width={width}
            height={height}
          />}
      </div>
      <form
        action={type === 'create' ? createPhotoAction : updatePhotoAction}
        onSubmit={() => blur()}
      >
        {/* Fields */}
        <div className="space-y-6">
          {FORM_METADATA_ENTRIES(
            sortTagsObjectWithoutFavs(uniqueTags ?? [])
              .map(({ tag, count }) => ({
                value: tag,
                annotation: formatCount(count),
                annotationAria: formatCountDescriptive(count, 'tagged'),
              })),
            aiContent !== undefined,
          )
            .map(([key, {
              label,
              note,
              required,
              selectOptions,
              selectOptionsDefaultLabel,
              tagOptions,
              readOnly,
              validate,
              validateStringMaxLength,
              capitalize,
              hideIfEmpty,
              shouldHide,
              loadingMessage,
              type,
            }]) =>
              (
                (!hideIfEmpty || formData[key]) &&
                !shouldHide?.(formData)
              ) &&
                <FieldSetWithStatus
                  key={key}
                  id={key}
                  label={label}
                  note={note}
                  error={formErrors[key]}
                  value={formData[key] ?? ''}
                  isModified={changedFormKeys.includes(key)}
                  onChange={value => {
                    const formUpdated = { ...formData, [key]: value };
                    setFormData(formUpdated);
                    if (validate) {
                      setFormErrors({ ...formErrors, [key]: validate(value) });
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
                  }}
                  selectOptions={selectOptions}
                  selectOptionsDefaultLabel={selectOptionsDefaultLabel}
                  tagOptions={tagOptions}
                  required={required}
                  readOnly={readOnly}
                  capitalize={capitalize}
                  placeholder={loadingMessage && !formData[key]
                    ? loadingMessage
                    : undefined}
                  loading={
                    (loadingMessage && !formData[key] ? true : false) ||
                    isFieldGeneratingAi(key)}
                  type={type}
                  accessory={aiButtonForField(key)}
                />)}
        </div>
        {/* Actions */}
        <div className={clsx(
          'flex gap-3 sticky bottom-0',
          'pb-4 md:pb-8 mt-12',
        )}>
          <Link
            className="button"
            href={type === 'edit' ? PATH_ADMIN_PHOTOS : PATH_ADMIN_UPLOADS}
          >
            Cancel
          </Link>
          <SubmitButtonWithStatus
            disabled={!canFormBeSubmitted}
            onFormStatusChange={onFormStatusChange}
            primary
          >
            {type === 'create' ? 'Create' : 'Update'}
          </SubmitButtonWithStatus>
          <div className={clsx(
            'absolute -top-16 -left-2 right-0 bottom-0 -z-10',
            'pointer-events-none',
            'bg-gradient-to-t',
            'from-white/90 from-60%',
            'dark:from-black/90 dark:from-50%',
          )} />
        </div>
      </form>
    </div>
  );
};
