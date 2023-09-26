'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  FORM_METADATA_ENTRIES,
  PhotoFormData,
} from './form';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import NextImage from 'next/image';
import { createPhotoAction, updatePhotoAction } from './actions';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { cc } from '@/utility/css';
import CanvasBlurCapture from '@/components/CanvasBlurCapture';

const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 200;

export default function PhotoForm({
  initialPhotoForm,
  type = 'create',
  debugBlur,
}: {
  initialPhotoForm: Partial<PhotoFormData>
  type?: 'create' | 'edit'
  debugBlur?: boolean
}) {
  const [formData, setFormData] =
    useState<Partial<PhotoFormData>>(initialPhotoForm);

  const url = formData.url ?? '';

  const [requestOrigin, setRequestOrigin] = useState<string>();
  useEffect(() => {
    setRequestOrigin(window.location.origin);
  }, []);

  const updateBlurData = useCallback((blurData: string) => {
    if (type === 'create') {
      setFormData(data => ({
        ...data,
        blurData,
      }));
    }
  }, [type]);

  const isFormValid = FORM_METADATA_ENTRIES.every(([key, { required }]) =>
    !required || Boolean(formData[key]));

  return (
    <div className="space-y-8 max-w-[38rem]">
      <NextImage
        alt="Upload"
        src={url}
        className={cc(
          'border rounded-md overflow-hidden',
          'border-gray-200 dark:border-gray-700'
        )}
        width={THUMBNAIL_WIDTH}
        height={THUMBNAIL_HEIGHT}
        priority
      />
      <CanvasBlurCapture
        imageUrl={url}
        width={THUMBNAIL_WIDTH}
        height={THUMBNAIL_HEIGHT}
        onCapture={updateBlurData}
      />
      {debugBlur && formData.blurData &&
        <img
          alt="blur"
          src={formData.blurData}
          width={1000}
        />}
      <form
        action={type === 'create' ? createPhotoAction : updatePhotoAction}
        className="space-y-6 pb-12"
      >
        {FORM_METADATA_ENTRIES.map(([key, {
          label,
          note,
          required,
          readOnly,
          hideIfEmpty,
          loadingMessage,
          checkbox,
        }]) =>
          (!hideIfEmpty || formData[key]) &&
            <FieldSetWithStatus
              key={key}
              id={key}
              label={label}
              note={note}
              value={formData[key] ?? ''}
              onChange={value => setFormData({ ...formData, [key]: value })}
              required={required}
              readOnly={readOnly}
              placeholder={loadingMessage && !formData[key]
                ? loadingMessage
                : undefined}
              loading={loadingMessage && !formData[key] ? true : false}
              type={checkbox ? 'checkbox' : undefined}
            />)}
        {type === 'create' &&
          <input
            name="requestOrigin"
            defaultValue={requestOrigin}
            readOnly
            hidden
          />}
        <div className="flex gap-4">
          {type === 'edit' &&
            <Link
              className="button"
              href="/admin/photos"
            >
              Cancel
            </Link>}
          <SubmitButtonWithStatus
            disabled={!isFormValid}
          >
            {type === 'create' ? 'Create' : 'Update'}
          </SubmitButtonWithStatus>
        </div>
      </form>
    </div>
  );
};
