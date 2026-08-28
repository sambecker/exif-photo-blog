import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { getRecipeDataForTitleAction } from '../actions';

export default function FieldsetRecipeData({
  recipeTitle,
  didCopyRecipeData,
  onRecipeDataFound,
  ...props
}: ComponentProps<typeof FieldsetWithStatus> & {
  recipeTitle?: string
  didCopyRecipeData?: boolean
  onRecipeDataFound: (recipeData: string) => void
}) {
  const { value } = props;

  const [isSearchingForData, setIsSearchingForData] = useState(false);

  // Track title edits rather than comparing against the stored title, so
  // removing and re-adding a title searches for its data again
  const previousTitle = useRef(recipeTitle);
  const wasTitleEdited = useRef(false);
  const searchedTitle = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (recipeTitle !== previousTitle.current) {
      previousTitle.current = recipeTitle;
      wasTitleEdited.current = true;
      searchedTitle.current = undefined;
    }

    if (
      recipeTitle &&
      wasTitleEdited.current &&
      // Search each title once, so hand-cleared data stays cleared
      recipeTitle !== searchedTitle.current &&
      // Only replace data which was copied from a previously-chosen title
      (!value || didCopyRecipeData)
    ) {
      let isStale = false;
      searchedTitle.current = recipeTitle;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSearchingForData(true);
      getRecipeDataForTitleAction(recipeTitle)
        .then(recipeData => {
          if (!isStale && recipeData && recipeData !== value) {
            onRecipeDataFound(recipeData);
          }
        })
        .finally(() => {
          if (!isStale) { setIsSearchingForData(false); }
        });
      return () => {
        isStale = true;
        setIsSearchingForData(false);
      };
    }
  }, [recipeTitle, value, didCopyRecipeData, onRecipeDataFound]);

  return <FieldsetWithStatus {...{
    ...props,
    loading: props.loading || isSearchingForData,
    placeholder: isSearchingForData
      ? 'Searching for matching recipe data ...'
      : props.placeholder,
  }} />;
}
