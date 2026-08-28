import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ComponentProps, useEffect, useState } from 'react';
import { getPhotosNeedingRecipeTitleCountAction } from '../actions';

export default function ApplyRecipeTitleGloballyCheckbox({
  photoId,
  recipeTitle,
  hasRecipeTitleChanged,
  recipeData,
  film,
  didCopyRecipeData,
  onMatchResults,
  ...props
}: ComponentProps<typeof FieldsetWithStatus> & {
  photoId?: string
  recipeTitle?: string
  hasRecipeTitleChanged?: boolean
  recipeData?: string
  film?: string
  didCopyRecipeData?: boolean
  onMatchResults: (didFindMatchingPhotos: boolean) => void
}) {
  const [matchingPhotosCount, setMatchingPhotosCount] = useState<number>();

  const shouldSearchForMatches = Boolean(
    recipeTitle &&
    hasRecipeTitleChanged &&
    recipeData &&
    film &&
    // Data copied from an existing title already belongs to that title
    !didCopyRecipeData,
  );

  const loading = shouldSearchForMatches && matchingPhotosCount === undefined;

  useEffect(() => {
    if (shouldSearchForMatches && recipeData && film) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatchingPhotosCount(undefined);
      getPhotosNeedingRecipeTitleCountAction(recipeData, film, photoId)
        .then(setMatchingPhotosCount);
    } else {
      setMatchingPhotosCount(0);
    }
  }, [shouldSearchForMatches, recipeData, film, photoId]);

  useEffect(() => {
    onMatchResults((matchingPhotosCount ?? 0) > 0);
  }, [matchingPhotosCount, onMatchResults]);

  const shouldShowFieldSet = loading || (matchingPhotosCount ?? 0) > 0;

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
