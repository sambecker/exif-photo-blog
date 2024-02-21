'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx/lite';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import { useRouter } from 'next/navigation';
import AnimateItems from './AnimateItems';
import { PATH_ROOT } from '@/site/paths';
import usePrefersReducedMotion from '@/utility/usePrefersReducedMotion';

export default function Modal({
  onClosePath,
  onClose,
  className,
  anchor = 'center',
  children,
  fast,
}: {
  onClosePath?: string
  onClose?: () => void
  className?: string
  anchor?: 'top' | 'center'
  children: ReactNode
  fast?: boolean
}) {
  const router = useRouter();

  const prefersReducedMotion = usePrefersReducedMotion();

  const contentRef = useRef<HTMLDivElement>(null);

  const [htmlElements, setHtmlElements] = useState<HTMLDivElement[]>([]);

  useEffect(() => {
    if (contentRef.current) {
      setHtmlElements([contentRef.current]);
    }
  }, []);

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
          key="modalContent"
          className={clsx(
            'p-3 rounded-lg',
            'bg-white dark:bg-black',
            'dark:border dark:border-gray-800',
            'md:p-4 md:rounded-xl',
            className,
          )}
          style={{ width: 'min(500px, 90vw)' }}
          ref={contentRef}
        >
          {children}
        </div>]}
      />
    </motion.div>
  );
};
