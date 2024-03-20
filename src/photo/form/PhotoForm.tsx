'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  FORM_METADATA_ENTRIES,
  PhotoFormData,
  convertFormKeysToLabels,
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
import {
  generateLocalNaivePostgresString,
  generateLocalPostgresString,
} from '@/utility/date';
import { toastSuccess, toastWarning } from '@/toast';
import { getDimensionsFromSize } from '@/utility/size';
import ImageBlurFallback from '@/components/ImageBlurFallback';
import { BLUR_ENABLED } from '@/site/config';
import { Tags, sortTagsObjectWithoutFavs } from '@/tag';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import Spinner from '@/components/Spinner';
import useImageQuery from '../ai/useImageQuery';

const THUMBNAIL_SIZE = 300;

export default function PhotoForm({
  initialPhotoForm,
  updatedExifData,
  type = 'create',
  uniqueTags,
  aiTextGeneration,
  debugBlur,
  onTitleChange,
  onFormStatusChange,
}: {
  initialPhotoForm: Partial<PhotoFormData>
  updatedExifData?: Partial<PhotoFormData>
  type?: 'create' | 'edit'
  uniqueTags?: Tags
  aiTextGeneration?: boolean
  debugBlur?: boolean
  onTitleChange?: (updatedTitle: string) => void
  onFormStatusChange?: (pending: boolean) => void
}) {
  const [formData, setFormData] =
    useState<Partial<PhotoFormData>>(initialPhotoForm);
  const [formErrors, setFormErrors] =
    useState(getFormErrors(initialPhotoForm));
  const [blurError, setBlurError] =
    useState<string>();
  const [imageData, setImageData] =
    useState<string>();

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

  // Generate local date strings when
  // none can be extracted from EXIF
  useEffect(() => {
    if (!formData.takenAt || !formData.takenAtNaive) {
      setFormData(data => ({
        ...data,
        ...!formData.takenAt && {
          takenAt: generateLocalPostgresString(),
        },
        ...!formData.takenAtNaive && {
          takenAtNaive: generateLocalNaivePostgresString(),
        },
      }));
    }
  }, [formData.takenAt, formData.takenAtNaive]);

  const url = formData.url ?? '';

  const updateBlurData = useCallback((blurData: string) => {
    if (BLUR_ENABLED) {
      setFormData(data => ({
        ...data,
        blurData,
      }));
    }
  }, []);

  // const [
  //   requestTitle,
  //   title,
  //   isLoadingTitle,
  //   errorTitle,
  // ] = useImageQuery(imageData, 'title');

  // const [
  //   requestCaption,
  //   caption,
  //   isLoadingCaption,
  //   errorCaption,
  // ] = useImageQuery(imageData, 'caption');

  const [
    requestTags,
    tags,
    isLoadingTags,
    errorTags,
  ] = useImageQuery(imageData, 'tags');

  const [
    requestRich,
    rich,
    isLoadingRich,
    errorRich,
  ] = useImageQuery(imageData, 'rich');

  // const [
  //   requestDescriptionSmall,
  //   descriptionSmall,
  //   isLoadingDescriptionSmall,
  //   errorDescriptionSmall,
  // ] = useImageQuery(imageData, 'descriptionSmall');

  const [
    requestSemantic,
    semantic,
    isLoadingSemantic,
    errorSemantic,
  ] = useImageQuery(imageData, 'semantic');

  const renderAiButton = (
    label: string,
    onClick: () => void,
    isLoading: boolean,
    error?: any,
  ) =>
    <button
      onClick={onClick}
      disabled={!imageData || isLoading}
      className={clsx(
        'flex gap-2 items-center justify-center',
        'disabled:opacity-50 text-sm px-2.5 min-h-0 py-1.5',
        Boolean(error) && 'error text-error',
      )}
    >
      <span>
        {label}
      </span>
      <span className="min-w-4">
        {isLoading
          ? <Spinner className="translate-y-[1.5px]" />
          : <>✨</>}
      </span>
    </button>;

  return (
    <div className="space-y-8 max-w-[38rem]">
      {blurError &&
        <div className="border error text-error rounded-md px-2 py-1">
          {blurError}
        </div>}
      <div className="flex gap-2 flex-wrap">
        {/* {renderAiButton(
          'Title',
          requestTitle,
          isLoadingTitle,
          errorTitle,
        )}
        {renderAiButton(
          'Caption',
          requestCaption,
          isLoadingCaption,
          errorCaption,
        )}
        {renderAiButton(
          'Tags',
          requestTags,
          isLoadingTags,
          errorTags,
        )} */}
        {renderAiButton(
          'Rich',
          requestRich,
          isLoadingRich,
          errorRich,
        )}
        {renderAiButton(
          'Tags',
          requestTags,
          isLoadingTags,
          errorTags,
        )}
        {renderAiButton(
          'Semantic',
          requestSemantic,
          isLoadingSemantic,
          errorSemantic,
        )}
        {/* {renderAiButton(
          'Description',
          requestDescriptionSmall,
          isLoadingDescriptionSmall,
          errorDescriptionSmall,
        )} */}
      </div>
      <div className="flex gap-2">
        <ImageBlurFallback
          alt="Upload"
          src={url}
          className={clsx(
            'border rounded-md overflow-hidden',
            'border-gray-200 dark:border-gray-700'
          )}
          width={width}
          height={height}
          priority
        />
        <CanvasBlurCapture
          imageUrl={url}
          width={width}
          height={height}
          onLoad={setImageData}
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
      {/* <p>
        ✨ TITLE: {title} {isLoadingTitle && <>
          <span className="inline-flex translate-y-[1.5px]">
            <Spinner />
          </span>
        </>}
      </p>
      <p>
        ✨ CAPTION: {caption} {isLoadingCaption && <>
          <span className="inline-flex translate-y-[1.5px]">
            <Spinner />
          </span>
        </>}
      </p> */}
      <p>
        ✨ RICH: {rich} {isLoadingRich && <>
          <span className="inline-flex translate-y-[1.5px]">
            <Spinner />
          </span>
        </>}
      </p>
      <p>
        ✨ TAGS: {tags} {isLoadingTags && <>
          <span className="inline-flex translate-y-[1.5px]">
            <Spinner />
          </span>
        </>}
      </p>
      <p>
        ✨ SEMANTIC: {semantic} {isLoadingSemantic && <>
          <span className="inline-flex translate-y-[1.5px]">
            <Spinner />
          </span>
        </>}
      </p>
      {/* <p>
        ✨ DESCRIPTION: {descriptionSmall} {isLoadingDescriptionSmall && <>
          <span className="inline-flex translate-y-[1.5px]">
            <Spinner />
          </span>
        </>}
      </p> */}
      <form
        action={type === 'create' ? createPhotoAction : updatePhotoAction}
        onSubmit={() => blur()}
        className="space-y-6"
      >
        {FORM_METADATA_ENTRIES(
          sortTagsObjectWithoutFavs(uniqueTags ?? [])
            .map(({ tag, count }) => ({
              value: tag,
              annotation: formatCount(count),
              annotationAria: formatCountDescriptive(count, 'tagged'),
            })),
          aiTextGeneration,
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
                onChange={value => {
                  setFormData({ ...formData, [key]: value });
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
                loading={loadingMessage && !formData[key] ? true : false}
                type={type}
              />)}
        <div className="flex gap-3">
          <Link
            className="button"
            href={type === 'edit' ? PATH_ADMIN_PHOTOS : PATH_ADMIN_UPLOADS}
          >
            Cancel
          </Link>
          <SubmitButtonWithStatus
            disabled={!isFormValid(formData)}
            onFormStatusChange={onFormStatusChange}
          >
            {type === 'create' ? 'Create' : 'Update'}
          </SubmitButtonWithStatus>
        </div>
      </form>
    </div>
  );
};
