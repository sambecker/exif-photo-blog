'use client';

import { motion } from 'framer-motion';
import { ReactNode, RefObject, useId } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { TbChecklist } from 'react-icons/tb';
import clsx from 'clsx/lite';
import LoaderButton from '@/components/primitives/LoaderButton';

export function RecipeOverlayTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 w-full min-w-0">
      <TbChecklist
        size={17}
        className="shrink-0 opacity-80 translate-y-[1px]"
      />
      <div className={clsx(
        'text-[15px] uppercase',
        'translate-y-[0.5px] tracking-wide',
        'truncate max-w-full',
      )}>
        {children}
      </div>
    </div>
  );
}

export default function RecipeOverlay({
  ref,
  title,
  actions,
  onClose,
  isOnPhoto = true,
  isDialog,
  className,
  children,
}: {
  ref?: RefObject<HTMLDivElement | null>
  title: ReactNode
  actions?: ReactNode
  onClose?: () => void
  isOnPhoto?: boolean
  isDialog?: boolean
  className?: string
  children: ReactNode
}) {
  const titleId = useId();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      role={isDialog ? 'dialog' : undefined}
      aria-labelledby={isDialog ? titleId : undefined}
      className={clsx(
        'z-10',
        'w-[20rem] max-w-full p-2 space-y-3',
        'scroll-mt-8',
        'rounded-2xl',
        isOnPhoto
          ? 'shadow-2xl'
          // Soften shadow to mimic <Modal />
          : 'shadow-2xl/20 dark:shadow-2xl/100',
        'text-[13.5px] text-black',
        'bg-white/70 outline outline-neutral-400/15',
        'backdrop-blur-xl saturate-[300%]',
        className,
      )}
    >
      <div className={clsx(
        'flex items-center gap-2 h-6',
        'pl-1.5 pr-0.5',
        'translate-y-[0.5px]',
      )}>
        <div id={titleId} className="grow min-w-0 translate-y-[0.5px]">
          {title}
        </div>
        {actions}
        <span>
          <LoaderButton
            aria-label="Close recipe"
            icon={<IoCloseCircle size={22} />}
            onClick={onClose}
            className={clsx(
              'link p-0 m-0',
              '-translate-y-px',
              'text-black/30 active:text-black/50',
            )}
          />
        </span>
      </div>
      {children}
    </motion.div>
  );
}
