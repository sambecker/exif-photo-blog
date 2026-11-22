import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import WarningNote from '@/components/WarningNote';
import Spinner from '@/components/Spinner';
import { parameterize, pluralize } from '@/utility/string';
import { getRecipeRenameCountAction } from '../actions';

export default function RecipeTitleRenameWarning({
  photoId,
  previousTitle,
  recipeTitle,
  recipeData,
  film,
}: {
  photoId?: string
  previousTitle?: string
  recipeTitle?: string
  recipeData?: string
  film?: string
}) {
  const [title] = useDebounce(
    recipeTitle ? parameterize(recipeTitle) : '',
    300,
  );
  const shouldSearchForMatches = Boolean(title && title !== previousTitle);

  const [result, setResult] = useState<{ key: string, count: number }>();
  const key = JSON.stringify([photoId, previousTitle, title, recipeData, film]);
  const loading = shouldSearchForMatches && result?.key !== key;

  useEffect(() => {
    if (!shouldSearchForMatches) { return; }
    let isStale = false;
    getRecipeRenameCountAction({
      photoId,
      previousTitle,
      title,
      recipeData,
      film,
    })
      .then(count => { if (!isStale) { setResult({ key, count }); } });
    return () => { isStale = true; };
  }, [
    shouldSearchForMatches,
    key,
    photoId,
    previousTitle,
    title,
    recipeData,
    film,
  ]);

  return loading
    ? <div className="flex items-center gap-2 text-dim">
      <Spinner />
      Scanning photos for matching recipes ...
    </div>
    : shouldSearchForMatches && (result?.count ?? 0) > 0
      ? <WarningNote>
        Title will be applied to
        {' '}
        {pluralize(result?.count ?? 0, 'matching photo')}
      </WarningNote>
      : null;
}
