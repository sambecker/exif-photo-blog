'use client';

import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx/lite';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import { useRouter } from 'next/navigation';
import AnimateItems from './AnimateItems';
import { PATH_ROOT } from '@/app/paths';
import usePrefersReducedMotion from '@/utility/usePrefersReducedMotion';
import useEscapeHandler from '@/utility/useEscapeHandler';
import { useTheme } from 'next-themes';

export default function Modal({
  onClosePath,
  onClose,
  className,
  anchor = 'center',
  container = true,
  children,
  noPadding,
  fast,
}: {
  onClosePath?: string
  onClose?: () => void
  className?: string
  anchor?: 'top' | 'center'
  container?: boolean
  children: ReactNode
  noPadding?: boolean
  fast?: boolean
}) {
  const router = useRouter();

  const prefersReducedMotion = usePrefersReducedMotion();

  const contentRef = useRef<HTMLDivElement>(null);

  const [htmlElements, setHtmlElements] =
    useState<RefObject<HTMLDivElement | null>[]>([]);

  useEffect(() => {
    if (contentRef.current) {
      setHtmlElements([contentRef]);
    }
  }, []);

  const { resolvedTheme } = useTheme();

  useClickInsideOutside({
    htmlElements,
    onClickOutside: () => {
      if (onClose) {
        onClose();
      } else {
        router.push(
          onClosePath ?? PATH_ROOT,
          { scroll: false },
        );
      }
    },
  });

  useEscapeHandler(onClose, true);

  return (
    <motion.div
      className={clsx(
        'fixed inset-0 z-50 flex justify-center',
        anchor === 'top'
          ? 'items-start pt-4 sm:pt-24'
          : 'items-center',
        'bg-white dark:bg-black',
      )}
      initial={!prefersReducedMotion
        ? { backgroundColor: resolvedTheme === 'dark'
          ? 'rgba(0, 0, 0, 0)'
          : 'rgba(255, 255, 255, 0)' }
        : false}
      animate={{ backgroundColor: resolvedTheme === 'dark'
        ? 'rgba(0, 0, 0, 0.80)'
        : 'rgba(255, 255, 255, 0.80)' }}
      transition={{ duration: 0.3, easing: 'easeOut' }}
    >
      <AnimateItems
        duration={fast ? 0.1 : 0.3}
        items={[<div
          ref={contentRef}
          key="modalContent"
          className={clsx(
            container && 'w-[calc(100vw-1.5rem)] sm:w-[min(540px,90vw)]',
            container && !noPadding && 'p-3 md:p-4',
            container && 'rounded-lg md:rounded-xl border-medium',
            container && 'bg-white dark:bg-black',
            container && 'shadow-2xl/20 dark:shadow-2xl/100',
            className,
          )}
        >
          {children}
        </div>]}
      />
    </motion.div>
  );
};
