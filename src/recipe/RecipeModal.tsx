'use client';

import Modal from '@/components/Modal';
import { useAppState } from '@/state/AppState';
import PhotoRecipeGrid from './PhotoRecipeGrid';

export default function ShareModals() {
  const {
    recipeModalProps,
    setRecipeModalProps,
  } = useAppState();

  if (recipeModalProps) {
    return <Modal
      onClose={() => setRecipeModalProps?.(undefined)}
      container={false}
    >
      <PhotoRecipeGrid {...{
        ...recipeModalProps,
        onClose: () => setRecipeModalProps?.(undefined),
      }}/>
    </Modal>;
  }
}
