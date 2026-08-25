'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { PATH_ADMIN_ALBUMS } from '@/app/path';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useAppState } from '@/app/AppState';
import { Album } from '@/album';
import { ALBUM_FORM_META } from '@/album/form';
import { parameterize } from '@/utility/string';
import { updateAlbumAction } from '@/album/actions';
import clsx from 'clsx/lite';
import PlaceInput from '@/place/PlaceInput';
import { convertPlaceToAutocomplete, Place } from '@/place';
import deepEqual from 'fast-deep-equal/es6/react';

export default function AdminAlbumForm({
  album,
  hasLocationServices,
  children,
}: {
  album: Album
  hasLocationServices?: boolean
  children?: ReactNode
}) {
  const { invalidateSwr } = useAppState();

  const [albumForm, setAlbumForm] = useState<Album>(album);

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
      action={updateAlbumAction}
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
            onChange={value => setAlbumForm(form => ({
              ...form,
              [key]: value,
              ...key === 'title' && { slug: parameterize(value) },
            }))
            }
            isModified={albumForm[key] !== album[key]}
            readOnly={readOnly}
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
            // eslint-disable-next-line max-len
            value={albumForm.location?.nameFormatted ?? albumForm.location?.name ?? ''}
            onChange={value => setAlbumForm(form => ({
              ...form,
              ...form.location && {
                location: { ...form.location, nameFormatted: value },
              },
            }))}
            isModified={
              // eslint-disable-next-line max-len
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
      <div className="flex gap-3">
        <Link
          className="button"
          href={PATH_ADMIN_ALBUMS}
        >
          Cancel
        </Link>
        <SubmitButtonWithStatus
          disabled={!isFormValid}
          onFormSubmit={invalidateSwr}
        >
          Update
        </SubmitButtonWithStatus>
      </div>
    </form>
  );
}
