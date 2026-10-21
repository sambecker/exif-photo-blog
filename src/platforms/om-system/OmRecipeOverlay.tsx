'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { RefObject, useEffect, useId } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { TbChecklist } from 'react-icons/tb';
import Link from 'next/link';
import { Camera, formatCameraText } from '@/camera';
import { pathForRecipe } from '@/app/path';
import { clsx } from 'clsx/lite';
import { labelForOmRecipe, OmRecipe } from './recipe';
import OmRecipeSettings from './OmRecipeSettings';

export default function OmRecipeOverlay({
  ref,
  recipe,
  recipeKey,
  camera,
  onClose,
  isOnPhoto = true,
}: {
  ref?: RefObject<HTMLDivElement | null>
  recipe: OmRecipe
  recipeKey: string
  camera?: Partial<Camera>
  onClose: () => void
  isOnPhoto?: boolean
}) {
  const titleId = useId();
  const descriptionId = useId();
  const cameraLabel = formatCameraText({
    make: camera?.make?.trim() ?? '',
    model: camera?.model?.trim() ?? '',
  }).trim();
  useEffect(() => {
    if (!isOnPhoto) { return; }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [isOnPhoto, onClose]);

  const title = <h2 id={titleId}
    className="flex min-w-0 items-center gap-1.5 text-[15px] uppercase">
    <TbChecklist size={17} className="shrink-0 opacity-80" />
    <Link href={pathForRecipe(recipeKey)} onClick={onClose}
      className="truncate tracking-wide hover:opacity-50 active:opacity-75">
      {labelForOmRecipe(recipe.kind)}
    </Link>
  </h2>;
  const description = <p id={descriptionId} className="text-xs text-black/50">
    {cameraLabel && `${cameraLabel} · `}Settings used for this photo
  </p>;

  return <motion.div ref={ref}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    role={isOnPhoto ? 'dialog' : undefined}
    aria-labelledby={isOnPhoto ? titleId : undefined}
    aria-describedby={isOnPhoto ? descriptionId : undefined}
    className={clsx(
      'z-10 max-h-[calc(100dvh-2rem)] overflow-y-auto p-2 space-y-3',
      ...(isOnPhoto ? [
        'w-[calc(100%-1rem)] max-w-5xl shadow-2xl',
        'self-start md:self-auto',
      ] : ['w-full shadow-2xl/20 dark:shadow-2xl/100']),
      'scroll-mt-8 rounded-2xl text-[13.5px] text-black',
      'bg-white/70 outline outline-neutral-400/15',
      'backdrop-blur-xl saturate-[300%]',
    )}>
    <div className="flex items-start justify-between gap-2 pl-1.5 pr-0.5">
      <div className="min-w-0 space-y-1 pt-1">
        {isOnPhoto ? title : <Dialog.Title asChild>{title}</Dialog.Title>}
        {isOnPhoto ? description :
          <Dialog.Description asChild>{description}</Dialog.Description>}
      </div>
      <button type="button" aria-label="Close recipe" onClick={onClose}
        className={clsx(
          'link m-0 shrink-0 border-transparent bg-transparent p-0 shadow-none',
          'text-black/30 hover:text-black/40 active:text-black/50',
        )}>
        <IoCloseCircle size={22} />
      </button>
    </div>
    <OmRecipeSettings recipe={recipe} />
  </motion.div>;
}
