import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import { ComponentProps, useEffect, useState } from 'react';
import { getPhotosNeedingRecipeTitleCountAction } from '../actions';

export default function ApplyRecipeTitleGloballyCheckbox({
  recipeTitle,
  hasRecipeTitleChanged,
  recipeData,
  ...props
}: ComponentProps<typeof FieldSetWithStatus> & {
  recipeTitle?: string
  hasRecipeTitleChanged?: boolean
  recipeData?: string
}) {
  const [matchingPhotosCount, setMatchingPhotosCount] = useState<number>();

  useEffect(() => {
    if (recipeTitle && hasRecipeTitleChanged && recipeData) {
      setMatchingPhotosCount(undefined);
      getPhotosNeedingRecipeTitleCountAction(recipeData)
        .then(setMatchingPhotosCount);
    } else {
      setMatchingPhotosCount(0);
    }
  }, [recipeTitle, hasRecipeTitleChanged, recipeData]);

  return (
    <FieldSetWithStatus {...{
      ...props,
      label: `Apply title to ${matchingPhotosCount} photos`,
      type: 'checkbox',
    }} />
  );
}
