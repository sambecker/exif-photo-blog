/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Photo } from '.';
import { useDebounce } from 'use-debounce';
import { searchPhotosAction } from './actions';

const formatQuery = (query: string) =>
  query.trim().toLocaleLowerCase();

export default function usePhotoQuery(
  query: string,
  isEnabled = true,
  minimumQueryLength = 2,
) {
  const [isLoading, setIsLoading] = useState(false);

  const queryFormatted = useMemo(() =>
    formatQuery(query), [query]);
  const [_queryDebounced] = useDebounce(query, 500, { leading: true });
  const queryDebounced = useMemo(() =>
    formatQuery(_queryDebounced), [_queryDebounced]);

  const [photos, setPhotos] = useState<Photo[]>([]);

  const reset = useCallback(() => {
    setPhotos([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (queryDebounced.length >= minimumQueryLength && isEnabled) {
      setIsLoading(true);
      searchPhotosAction(queryDebounced)
        .then(setPhotos)
        .finally(() => setIsLoading(false));
    }
  }, [
    queryDebounced,
    minimumQueryLength,
    isEnabled,
  ]);

  useEffect(() => {
    if (queryFormatted.length >= minimumQueryLength) {
      setIsLoading(true);
    } else {
      setPhotos([]);
      setIsLoading(false);
    }
  }, [minimumQueryLength, queryFormatted]);

  return {
    queryFormatted,
    photos,
    isLoading,
    reset,
  };
}
