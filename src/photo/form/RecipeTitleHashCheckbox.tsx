import { useId, useRef, useState } from 'react';
import clsx from 'clsx/lite';
import Checkbox from '@/components/Checkbox';
import Spinner from '@/components/Spinner';
import { canCreateRecipeHashKey, isRecipeHashKey } from '@/recipe/key';
import { getRecipeHashKeyAction } from '../actions';

export default function RecipeTitleHashCheckbox({
  recipeTitle,
  recipeData,
  onChange,
}: {
  recipeTitle?: string
  recipeData?: string
  onChange: (recipeTitle: string) => void
}) {
  const [isLoading, setIsLoading] = useState(false);
  // Restored when switching back from hash format
  const customTitle = useRef<string>(undefined);

  const id = useId();

  const isHash = isRecipeHashKey(recipeTitle);
  const isDisabled =
    isLoading || (!isHash && !canCreateRecipeHashKey(recipeData));

  return (
    <label htmlFor={id} className={clsx(
      'inline-flex items-center gap-1.5 select-none',
      isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
    )}>
      <Checkbox
        id={id}
        checked={isHash}
        disabled={isDisabled}
        readOnly={isDisabled}
        accessory={isLoading && <Spinner className="translate-y-[0.5px]" />}
        onChange={e => {
          if (e.target.checked) {
            customTitle.current = recipeTitle;
            setIsLoading(true);
            getRecipeHashKeyAction(recipeData)
              .then(key => { if (key) { onChange(key); } })
              .finally(() => setIsLoading(false));
          } else {
            onChange(customTitle.current ?? '');
          }
        }}
      />
      <span className={clsx(isDisabled && 'opacity-50')}>
        auto-title
      </span>
    </label>
  );
}
