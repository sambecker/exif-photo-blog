'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { PARAM_REDIRECT, PATH_ADMIN_ALBUMS } from '@/app/path';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useAppState } from '@/app/AppState';
import { Album } from '@/album';
import { ALBUM_FORM_META } from '@/album/form';
import { parameterize } from '@/utility/string';
import { createAlbumAction, updateAlbumAction } from '@/album/actions';
import clsx from 'clsx/lite';
import PlaceInput from '@/place/PlaceInput';
import { convertPlaceToAutocomplete, Place } from '@/place';
import deepEqual from 'fast-deep-equal/es6/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminAlbumForm({
  album = {
    id: '',
    title: '',
    slug: '',
  },
  hasLocationServices,
  children,
  mode = 'edit',
  onTitleChange,
}: {
  album?: Album
  hasLocationServices?: boolean
  children?: ReactNode
  mode?: 'edit' | 'create'
  onTitleChange?: (title: string) => void
}) {
  const { invalidateSwr } = useAppState();
  const router = useRouter();
  const redirectParam = useSearchParams().get(PARAM_REDIRECT);

  const isCreating = mode === 'create';

  const [albumForm, setAlbumForm] = useState<Album>(album);
  const [formError, setFormError] = useState('');

  const initialPlace = useMemo(() =>
    convertPlaceToAutocomplete(album.location),
  [album.location]);
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);
  const setPlace = useCallback((place?: Place) =>
    setAlbumForm(form => ({
      ...form,
      location: place,
    })), []);

  const isFormValid = useMemo(() => {
    return ALBUM_FORM_META.every(({ key, required }) => {
      return !required || Boolean(albumForm[key]);
    });
  }, [albumForm]);

  return (
    <form
      action={data => {
        const submit = isCreating ? createAlbumAction : updateAlbumAction;
        return submit(data)
          .then(result => {
            if (result && 'error' in result && result.error) {
              setFormError(result.error);
              return;
            }
            router.push(redirectParam ?? PATH_ADMIN_ALBUMS);
          });
      }}
      className="max-w-[38rem] space-y-4"
    >
      {ALBUM_FORM_META
        .map(({ key, label, type, readOnly }) => (
          <FieldsetWithStatus
            key={key}
            id={key}
            type={type}
            label={label ?? key}
            value={albumForm[key] ? `${albumForm[key]}` : ''}
            onChange={value => {
              if (key === 'title') {
                setFormError('');
                onTitleChange?.(value);
              }
              setAlbumForm(form => ({
                ...form,
                [key]: value,
                ...key === 'title' && { slug: parameterize(value) },
              }));
            }}
            isModified={albumForm[key] !== album[key]}
            readOnly={readOnly}
            error={key === 'title' ? formError : undefined}
            className={clsx(key === 'description' && '[&_textarea]:h-36')}
          />))}
      {hasLocationServices &&
        <PlaceInput {...{
          initialPlace,
          setPlace,
          setIsLoadingPlace,
          className: 'relative z-1',
        }} />}
      {(albumForm.location || isLoadingPlace) &&
        <div className="space-y-4 w-full">
          <FieldsetWithStatus
            label="Location Display Name"
            // eslint-disable-next-line @stylistic/max-len
            value={albumForm.location?.nameFormatted ?? albumForm.location?.name ?? ''}
            onChange={value => setAlbumForm(form => ({
              ...form,
              ...form.location && {
                location: { ...form.location, nameFormatted: value },
              },
            }))}
            isModified={
              // eslint-disable-next-line @stylistic/max-len
              (albumForm.location?.nameFormatted ?? albumForm.location?.name) !==
              (album.location?.nameFormatted ?? album.location?.name)
            }
            readOnly={isLoadingPlace}
          />
          <FieldsetWithStatus
            id="location"
            label="Location Data"
            type="textarea"
            value={JSON.stringify(albumForm.location)}
            isModified={!deepEqual(albumForm.location, album.location)}
            // Make field editable when location services are disabled
            // to allow data to be manually cleared
            readOnly={isLoadingPlace || hasLocationServices}
          />
        </div>}
      {children}
      <div className={clsx(
        'flex gap-3 sticky bottom-0',
        'pb-4 md:pb-8 mt-16',
        'relative z-10',
      )}>
        <Link
          className="button"
          href={PATH_ADMIN_ALBUMS}
        >
          Cancel
        </Link>
        <SubmitButtonWithStatus
          disabled={!isFormValid}
          onFormSubmit={invalidateSwr}
          hideText="never"
          primary
        >
          {isCreating ? 'Create' : 'Update'}
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
  );
}
