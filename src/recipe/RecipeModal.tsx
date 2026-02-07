'use client';

import Modal from '@/components/Modal';
import { useAppState } from '@/app/AppState';
import PhotoRecipeOverlay from './PhotoRecipeOverlay';

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
      <PhotoRecipeOverlay {...{
        ...recipeModalProps,
        onClose: () => setRecipeModalProps?.(undefined),
        isOnPhoto: false,
      }}/>
    </Modal>;
  }
}
