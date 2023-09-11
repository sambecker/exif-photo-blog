'use client';

import { useEffect, useRef, useState } from 'react';
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

const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 200;
const EDGE_BLUR_COMPENSATION = 10;
const BLUR_SCALE = 0.5;
const BLUE_JPEG_QUALITY = 0.9;

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

  const [showBlur, setShowBlur] = useState(debugBlur);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const url = formData.url ?? '';

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = url;
    image.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = THUMBNAIL_WIDTH * BLUR_SCALE;
        canvas.height = THUMBNAIL_HEIGHT * BLUR_SCALE;
        canvas.style.width = `${THUMBNAIL_WIDTH}px`;
        canvas.style.height = `${THUMBNAIL_HEIGHT}px`;
        const context = canvasRef.current?.getContext('2d');
        if (context) {
          context.scale(BLUR_SCALE, BLUR_SCALE);
          context.filter =
            'contrast(1.2) saturate(1.2)' +
            `blur(${BLUR_SCALE * 10}px)`;
          context.drawImage(
            image,
            -EDGE_BLUR_COMPENSATION,
            -EDGE_BLUR_COMPENSATION,
            THUMBNAIL_WIDTH + EDGE_BLUR_COMPENSATION * 2,
            THUMBNAIL_WIDTH * image.height / image.width
              + EDGE_BLUR_COMPENSATION * 2,
          );
          if (type === 'create') {
            setFormData(data => ({
              ...data,
              blurData: canvas.toDataURL('image/jpeg', BLUE_JPEG_QUALITY),
            }));
          }
        }
      }
    };
  }, [url, type]);

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
      <canvas
        ref={canvasRef}
        className="hidden"
        onClick={() => setShowBlur(!showBlur)}
      />
      {showBlur && formData.blurData &&
        <img
          alt="blur"
          src={formData.blurData}
          width={1000}
        />}
      <form
        action={type === 'create' ? createPhotoAction : updatePhotoAction}
        className="space-y-6 pb-12"
      >
        {FORM_METADATA_ENTRIES.map(([
          key,
          { label, required, readOnly, hideIfEmpty },
        ]) =>
          (!hideIfEmpty || formData[key]) &&
            <FieldSetWithStatus
              key={key}
              id={key}
              label={label}
              value={formData[key] ?? ''}
              onChange={value => setFormData({ ...formData, [key]: value })}
              required={required}
              readOnly={readOnly}
            />)}
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
