import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ComponentProps, useEffect, useState } from 'react';
import { getPhotosNeedingRecipeTitleCountAction } from '../actions';

export default function ApplyRecipeTitleGloballyCheckbox({
  photoId,
  recipeTitle,
  hasRecipeTitleChanged,
  recipeData,
  film,
  onMatchResults,
  ...props
}: ComponentProps<typeof FieldsetWithStatus> & {
  photoId?: string
  recipeTitle?: string
  hasRecipeTitleChanged?: boolean
  recipeData?: string
  film?: string
  onMatchResults: (didFindMatchingPhotos: boolean) => void
}) {
  const [matchingPhotosCount, setMatchingPhotosCount] = useState<number>();

  const loading = matchingPhotosCount === undefined;

  useEffect(() => {
    if (recipeTitle && hasRecipeTitleChanged && recipeData && film) {
      setMatchingPhotosCount(undefined);
      getPhotosNeedingRecipeTitleCountAction(recipeData, film, photoId)
        .then(setMatchingPhotosCount);
    } else {
      setMatchingPhotosCount(0);
    }
  }, [recipeTitle, hasRecipeTitleChanged, recipeData, film, photoId]);

  useEffect(() => {
    onMatchResults((matchingPhotosCount ?? 0) > 0);
  }, [matchingPhotosCount, onMatchResults]);

  const shouldShowFieldSet = loading || matchingPhotosCount > 0;

  return (
    shouldShowFieldSet
      ? <FieldsetWithStatus {...{
        ...props,
        label: loading
          ? 'Scanning photos for matching recipes ...'
          : `Apply title to ${matchingPhotosCount} matching photos`,
        type: 'checkbox',
        className: '-mt-4 translate-x-[4px]',
        loading,
      }} />
      : null
  );
}
