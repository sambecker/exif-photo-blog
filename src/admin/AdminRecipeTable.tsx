import FormWithConfirm from '@/components/FormWithConfirm';
import { deletePhotoRecipeGloballyAction } from '@/photo/actions';
import AdminTable from '@/admin/AdminTable';
import { Fragment } from 'react';
import DeleteFormButton from '@/admin/DeleteFormButton';
import { photoQuantityText } from '@/photo';
import EditButton from '@/admin/EditButton';
import { pathForAdminRecipeEdit } from '@/app/paths';
import { clsx } from 'clsx/lite';
import { formatRecipe, Recipes, sortRecipes } from '@/recipe';
import AdminRecipeBadge from './AdminRecipeBadge';

export default function AdminRecipeTable({
  recipes,
}: {
  recipes: Recipes
}) {
  return (
    <AdminTable>
      {sortRecipes(recipes).map(({ recipe, count }) =>
        <Fragment key={recipe}>
          <div className="pr-2 col-span-2">
            <AdminRecipeBadge {...{ recipe, count }} />
          </div>
          <div className={clsx(
            'flex flex-nowrap',
            'gap-2 sm:gap-3 items-center',
          )}>
            <EditButton path={pathForAdminRecipeEdit(recipe)} />
            <FormWithConfirm
              action={deletePhotoRecipeGloballyAction}
              confirmText={
                // eslint-disable-next-line max-len
                `Are you sure you want to remove "${formatRecipe(recipe)}" from ${photoQuantityText(count, false).toLowerCase()}?`}
            >
              <input type="hidden" name="recipe" value={recipe} />
              <DeleteFormButton clearLocalState />
            </FormWithConfirm>
          </div>
        </Fragment>)}
    </AdminTable>
  );
}
