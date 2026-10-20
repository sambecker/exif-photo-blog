'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LuSlidersHorizontal } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import EntityLink, { EntityLinkExternalProps }
  from '@/components/entity/EntityLink';
import IconRecipe from '@/components/icons/IconRecipe';
import { pathForRecipe } from '@/app/path';
import { labelForOmRecipe, OmRecipe } from './recipe';
import OmRecipeSettings from './OmRecipeSettings';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/app/AppState';

export default function PhotoOmRecipe({
  recipe,
  recipeKey,
  ...props
}: {
  recipe: OmRecipe
  recipeKey: string
} & EntityLinkExternalProps) {
  const [open, setOpen] = useState(false);
  const { setShouldRespondToKeyboardCommands } = useAppState();
  useEffect(() => {
    if (!open) { return; }
    setShouldRespondToKeyboardCommands?.(false);
    return () => setShouldRespondToKeyboardCommands?.(true);
  }, [open, setShouldRespondToKeyboardCommands]);
  const label = labelForOmRecipe(recipe.kind);
  const path = pathForRecipe(recipeKey);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <EntityLink {...props}
      title="Recipe"
      label={label}
      labelAria={label}
      path={path}
      hoverQueryOptions={{ recipe: recipeKey }}
      icon={<IconRecipe size={16} />}
      action={<Dialog.Trigger asChild>
        <button type="button"
          aria-label={`Show ${label.toLowerCase()} settings`}
          title={`Show ${label.toLowerCase()} settings`}
          className={clsx(
            'inline-flex size-5 items-center justify-center rounded-md p-0',
            'border-transparent shadow-none',
            'bg-dim text-medium hover:bg-medium hover:text-main',
          )}>
          <LuSlidersHorizontal size={14} className="shrink-0" />
        </button>
      </Dialog.Trigger>}
    />
    <Dialog.Portal>
      <Dialog.Overlay className={clsx(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
      )} />
      <Dialog.Content onEscapeKeyDown={event => event.stopPropagation()}
        className={clsx(
          'fixed left-1/2 top-1/2 z-[60] max-h-[calc(100dvh-2rem)]',
          'w-[calc(100vw-2rem)] max-w-5xl',
          '-translate-x-1/2 -translate-y-1/2 overflow-y-auto',
          'rounded-xl border border-neutral-300 bg-white p-4',
          'shadow-2xl outline-none dark:border-neutral-700',
          'dark:bg-neutral-950 sm:p-6',
        )}>
        <div className={clsx(
          'sticky top-0 z-10 mb-5 flex items-start justify-between gap-4',
          'bg-white pb-3 dark:bg-neutral-950',
        )}>
          <div>
            <Dialog.Title className="text-lg font-medium">
              <Link href={path} onClick={() => setOpen(false)}
                className="hover:underline">{label}</Link>
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-xs text-medium">
              OM SYSTEM / Olympus · Settings used for this photo
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <button type="button" aria-label="Close recipe"
              className="rounded p-1 text-medium hover:text-main">
              <IoClose size={24} />
            </button>
          </Dialog.Close>
        </div>
        <OmRecipeSettings recipe={recipe} />
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
