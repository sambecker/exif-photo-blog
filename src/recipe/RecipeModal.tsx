'use client';

import Modal from '@/components/Modal';
import { useAppState } from '@/state/AppState';
import PhotoRecipeOverlay from './PhotoRecipeOverlay';

export default function ShareModals() {
  const {
    recipeModalProps,
    setRecipeModalProps,
  } = useAppState();

  if (recipeModalProps) {
    return <Modal
      className="bg-transparent!"
      onClose={() => setRecipeModalProps?.(undefined)}
      container={false}
    >
      <PhotoRecipeOverlay {...{
        ...recipeModalProps,
        onClose: () => setRecipeModalProps?.(undefined),
      }}/>
    </Modal>;
  }
}
