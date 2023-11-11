'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cc } from '@/utility/css';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import { useRouter } from 'next/navigation';
import AnimateItems from './AnimateItems';
import { PATH_ROOT } from '@/site/paths';
import usePrefersReducedMotion from '@/utility/usePrefersReducedMotion';

export default function Modal({
  onClosePath,
  children,
}: {
  onClosePath?: string
  children: ReactNode
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
    onClickOutside: () => router.push(
      onClosePath ?? PATH_ROOT,
      { scroll: false },
    ),
  });

  return (
    <motion.div
      className={cc(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black',
      )}
      initial={!prefersReducedMotion
        ? { backgroundColor: 'rgba(0, 0, 0, 0)' }
        : false}
      animate={{ backgroundColor: 'rgba(0, 0, 0, 0.80)' }}
      transition={{ duration: 0.3, easing: 'easeOut' }}
    >
      <AnimateItems
        duration={0.3}
        items={[<div
          key="modalContent"
          className={cc(
            'p-3 rounded-lg',
            'bg-white dark:bg-black',
            'dark:border dark:border-gray-800',
            'md:p-4 md:rounded-xl',
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
