'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { PATH_ADMIN_RECIPES } from '@/app/paths';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import { ReactNode, useMemo, useState } from 'react';
import { renamePhotoRecipeGloballyAction } from '@/photo/actions';
import { parameterize } from '@/utility/string';
import { useAppState } from '@/app/AppState';

export default function AdminRecipeForm({
  recipe,
  children,
}: {
  recipe: string
  children?: ReactNode
}) {
  const { invalidateSwr } = useAppState();

  const [updatedRecipeRaw, setUpdatedRecipeRaw] = useState(recipe);

  const updatedRecipe = useMemo(() =>
    parameterize(updatedRecipeRaw)
  , [updatedRecipeRaw]);

  const isFormValid = (
    updatedRecipe &&
    updatedRecipe !== recipe
  );

  return (
    <form
      action={renamePhotoRecipeGloballyAction}
      className="space-y-8"
    >
      <FieldSetWithStatus
        label="New Recipe Name"
        value={updatedRecipeRaw}
        onChange={setUpdatedRecipeRaw}
      />
      {/* Form data: recipe to be replaced */}
      <input
        name="recipe"
        value={recipe}
        hidden
        readOnly
      />
      {/* Form data: updated recipe */}
      <input
        name="updatedRecipe"
        value={updatedRecipe}
        hidden
        readOnly
      />
      {children}
      <div className="flex gap-3">
        <Link
          className="button"
          href={PATH_ADMIN_RECIPES}
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
