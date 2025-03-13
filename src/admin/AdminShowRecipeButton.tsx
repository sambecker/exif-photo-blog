'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FujifilmSimulation } from '@/platforms/fujifilm/simulation';
import { useAppState } from '@/state/AppState';
import { TbChecklist } from 'react-icons/tb';

export default function AdminShowRecipeButton({
  title,
  recipe,
  simulation,
}: {
  title: string
  recipe: FujifilmRecipe
  simulation: FujifilmSimulation
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
        simulation,
      })}
    >
        Preview
    </LoaderButton>
  );
}