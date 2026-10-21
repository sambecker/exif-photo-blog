'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { RefObject, useEffect, useState } from 'react';
import EntityLink, { EntityLinkExternalProps }
  from '@/components/entity/EntityLink';
import IconRecipe from '@/components/icons/IconRecipe';
import { pathForRecipe } from '@/app/path';
import { labelForOmRecipe, OmRecipe } from './recipe';
import OmRecipeOverlay from './OmRecipeOverlay';
import { useAppState } from '@/app/AppState';
import { Camera } from '@/camera';
import PhotoRecipeOverlayButton from '@/recipe/PhotoRecipeOverlayButton';
import { clsx } from 'clsx/lite';
import useMediaQuery from '@/utility/useMediaQuery';

export default function PhotoOmRecipe({
  ref,
  recipe,
  recipeKey,
  camera,
  toggleRecipeOverlay,
  isShowingRecipeOverlay,
  ...props
}: {
  ref?: RefObject<HTMLDivElement | null>
  recipe: OmRecipe
  recipeKey: string
  camera?: Partial<Camera>
  toggleRecipeOverlay?: () => void
  isShowingRecipeOverlay?: boolean
} & EntityLinkExternalProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isOnPhoto =
    toggleRecipeOverlay !== undefined && isDesktop && !modalOpen;
  const open = isOnPhoto ? Boolean(isShowingRecipeOverlay) : modalOpen;
  const { setShouldRespondToKeyboardCommands } = useAppState();
  useEffect(() => {
    if (!open) { return; }
    setShouldRespondToKeyboardCommands?.(false);
    return () => setShouldRespondToKeyboardCommands?.(true);
  }, [open, setShouldRespondToKeyboardCommands]);
  const label = labelForOmRecipe(recipe.kind);
  const trigger = <PhotoRecipeOverlayButton
    toggleRecipeOverlay={isOnPhoto ? toggleRecipeOverlay : undefined}
    isShowingRecipeOverlay={open}
    aria-label={`${open ? 'Hide' : 'Show'} ${label.toLowerCase()} settings`}
    aria-expanded={open}
  />;
  return <Dialog.Root open={modalOpen} onOpenChange={value => {
    setModalOpen(value);
    if (value && isShowingRecipeOverlay) { toggleRecipeOverlay?.(); }
  }}>
    <EntityLink {...props} ref={ref}
      title="Recipe"
      label={label}
      labelAria={label}
      path={pathForRecipe(recipeKey)}
      hoverQueryOptions={{ recipe: recipeKey }}
      icon={<IconRecipe size={16} />}
      action={isOnPhoto ? trigger :
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
    />
    {!isOnPhoto && <Dialog.Portal>
      <Dialog.Overlay
        className="fixed inset-0 z-50 bg-white/90 dark:bg-black/80" />
      <Dialog.Content onEscapeKeyDown={event => event.stopPropagation()}
        className={clsx(
          'fixed left-1/2 top-1/2 z-[60] w-[calc(100vw-2rem)] max-w-5xl',
          '-translate-x-1/2 -translate-y-1/2 outline-none',
        )}>
        <OmRecipeOverlay recipe={recipe} recipeKey={recipeKey}
          camera={camera} onClose={() => setModalOpen(false)}
          isOnPhoto={false} />
      </Dialog.Content>
    </Dialog.Portal>}
  </Dialog.Root>;
}
