import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import { ComponentProps, useEffect, useState } from 'react';
import { getPhotosNeedingRecipeTitleCountAction } from '../actions';
import { FilmSimulation } from '@/simulation';
import Spinner from '@/components/Spinner';

export default function ApplyRecipeTitleGloballyCheckbox({
  photoId,
  recipeTitle,
  hasRecipeTitleChanged,
  recipeData,
  simulation,
  onMatchResults,
  ...props
}: ComponentProps<typeof FieldSetWithStatus> & {
  photoId?: string
  recipeTitle?: string
  hasRecipeTitleChanged?: boolean
  recipeData?: string
  simulation?: FilmSimulation
  onMatchResults: (didFindMatchingPhotos: boolean) => void
}) {
  const [matchingPhotosCount, setMatchingPhotosCount] = useState<number>();

  const isLoading = matchingPhotosCount === undefined;

  useEffect(() => {
    if (recipeTitle && hasRecipeTitleChanged && recipeData && simulation) {
      setMatchingPhotosCount(undefined);
      getPhotosNeedingRecipeTitleCountAction(recipeData, simulation, photoId)
        .then(setMatchingPhotosCount);
    } else {
      setMatchingPhotosCount(0);
    }
  }, [recipeTitle, hasRecipeTitleChanged, recipeData, simulation, photoId]);

  useEffect(() => {
    onMatchResults((matchingPhotosCount ?? 0) > 0);
  }, [matchingPhotosCount, onMatchResults]);

  const shouldShowFieldSet = isLoading || matchingPhotosCount > 0;

  return (
    shouldShowFieldSet
      ? <FieldSetWithStatus {...{
        ...props,
        label: isLoading
          ? 'Scanning photos for matching recipes ...'
          : `Apply title to ${matchingPhotosCount} matching photos`,
        type: 'checkbox',
        readOnly: isLoading,
        className: '-mt-4 translate-x-[1px]',
        checkboxAccessory: isLoading
          ? <Spinner className="translate-y-[1.5px]" />
          : null,
      }} />
      : null
  );
}
