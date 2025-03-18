'use client';

import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx/lite';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import { useRouter } from 'next/navigation';
import AnimateItems from './AnimateItems';
import { PATH_ROOT } from '@/app/paths';
import usePrefersReducedMotion from '@/utility/usePrefersReducedMotion';
import useMetaThemeColor from '@/utility/useMetaThemeColor';
import useEscapeHandler from '@/utility/useEscapeHandler';

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

  useMetaThemeColor({ colorLight: '#333' });

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
        'bg-black',
      )}
      initial={!prefersReducedMotion
        ? { backgroundColor: 'rgba(0, 0, 0, 0)' }
        : false}
      animate={{ backgroundColor: 'rgba(0, 0, 0, 0.80)' }}
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
            container && 'rounded-lg md:rounded-xl',
            container && 'dark:border dark:border-gray-800',
            'bg-white dark:bg-black',
            className,
          )}
        >
          {children}
        </div>]}
      />
    </motion.div>
  );
};
