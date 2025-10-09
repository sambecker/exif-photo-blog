'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { PATH_ADMIN_ALBUMS } from '@/app/path';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ReactNode, useCallback, useMemo, useState} from 'react';
import { useAppState } from '@/app/AppState';
import { Album } from '@/album';
import { ALBUM_FORM_META } from '@/album/form';
import { parameterize } from '@/utility/string';
import { updateAlbumAction } from '@/album/actions';
import clsx from 'clsx/lite';
import PlaceInput from '@/place/PlaceInput';
import { PlaceDetail } from '@/platforms/google-places';

export default function AdminAlbumForm({
  album,
  children,
}: {
  album: Album
  children?: ReactNode
}) {
  const { invalidateSwr } = useAppState();

  const [albumForm, setAlbumForm] = useState<Album>(album);

  const [place, setPlace] = useState<PlaceDetail>();
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);

  const isFormValid = useMemo(() => {
    return ALBUM_FORM_META.every(({ key, required }) => {
      return !required || Boolean(albumForm[key]);
    });
  }, [albumForm]);

  const updateAlbum = useCallback((key: keyof Album, value: string) => {
    setAlbumForm(form => ({
      ...form,
      [key]: value,
      ...key === 'title' && { slug: parameterize(value) },
    }));
  }, []);

  return (
    <form
      action={updateAlbumAction}
      className="max-w-[38rem] space-y-4"
    >
      <PlaceInput {...{
        place,
        setPlace,
        isLoadingPlace,
        setIsLoadingPlace,
      }} />
      {(place || isLoadingPlace) &&
      <div className="text-sm text-dim">
        {!place
          ? 'Loading...'
          : <>
            <div>{place.id}</div>
            <div>{place.name}</div>
            <div>{place.link}</div>
            <div>{place.location?.latitude}</div>
            <div>{place.location?.longitude}</div>
            <div>{place.viewport?.low.latitude}</div>
            <div>{place.viewport?.low.longitude}</div>
            <div>{place.viewport?.high.latitude}</div>
            <div>{place.viewport?.high.longitude}</div>
          </>}
      </div>}
      {ALBUM_FORM_META
        .map(({ key, label, type, readOnly }) => (
          <FieldsetWithStatus
            key={key}
            id={key}
            type={type}
            label={label ?? key}
            value={albumForm[key] ? `${albumForm[key]}` : ''}
            onChange={value => updateAlbum(key, value)}
            isModified={albumForm[key] !== album[key]}
            readOnly={readOnly}
            className={clsx(key === 'description' && '[&_textarea]:h-36')}
          />))}
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
