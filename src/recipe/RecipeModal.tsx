'use client';

import Modal from '@/components/Modal';
import { useAppState } from '@/state/AppState';
import PhotoRecipeOGTile from './PhotoRecipeOGTile';

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
      <PhotoRecipeOGTile {...recipeModalProps}/>
    </Modal>;
  }
}
