'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FujifilmSimulation } from '@/platforms/fujifilm/simulation';
import { useAppState } from '@/state/AppState';
import { TbChecklist } from 'react-icons/tb';

export default function AdminShowRecipeButton({
  title,
  recipe,
  film,
}: {
  title: string
  recipe: FujifilmRecipe
  film: FujifilmSimulation
}) {
  const { setRecipeModalProps } = useAppState();

  return (
    <LoaderButton
      icon={<TbChecklist
        size={17}
        className="translate-y-[1px]"
      />}
      onClick={() => setRecipeModalProps?.({
        title,
        recipe,
        film,
      })}
    >
        Preview
    </LoaderButton>
  );
}