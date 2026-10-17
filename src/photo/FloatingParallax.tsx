'use client';

import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import usePrefersReducedMotion from '@/utility/usePrefersReducedMotion';

// Alternating travel distances (px) over the element's view pass
const PARALLAX_EVEN_PX = 56;
const PARALLAX_ODD_PX = 100;

export default function FloatingParallax({
  index,
  children,
}: {
  index: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const half = (index % 2 === 0
    ? PARALLAX_EVEN_PX
    : PARALLAX_ODD_PX) / 2;

  // Split the travel: −half → +half (odd inverted so neighbors converge)
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion
      ? [0, 0]
      : index % 2 === 0
        ? [-half, half]
        : [half, -half],
  );

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
