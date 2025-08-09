'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { RecipeProps } from '@/recipe';
import { useAppState } from '@/app/AppState';
import { TbChecklist } from 'react-icons/tb';

export default function AdminShowRecipeButton(props: RecipeProps) {
  const { setRecipeModalProps } = useAppState();

  return (
    <LoaderButton
      icon={<TbChecklist
        size={17}
        className="translate-y-[1px]"
      />}
      onClick={() => setRecipeModalProps?.(props)}
    >
      Preview
    </LoaderButton>
  );
}
