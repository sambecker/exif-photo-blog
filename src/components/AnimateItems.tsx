'use client';

import { ReactNode, useRef } from 'react';
import { Variant, motion } from 'framer-motion';
import { useAppState } from '@/state';
import usePrefersReducedMotion from '@/utility/usePrefersReducedMotion';

export type AnimationType = 'none' | 'scale' | 'left' | 'right' | 'bottom';

export interface AnimationConfig {
  type?: AnimationType
  duration?: number
  staggerDelay?: number
  scaleOffset?: number
  distanceOffset?: number
}

interface Props extends AnimationConfig {
  className?: string
  classNameItem?: string
  items: ReactNode[]
  animateFromAppState?: boolean
  animateOnFirstLoadOnly?: boolean
  staggerOnFirstLoadOnly?: boolean
}

function AnimateItems({
  className,
  classNameItem,
  items,
  type = 'scale',
  duration = 0.6,
  staggerDelay = 0.1,
  scaleOffset = 0.9,
  distanceOffset = 20,
  animateFromAppState,
  animateOnFirstLoadOnly,
  staggerOnFirstLoadOnly,
}: Props) {
  const {
    hasLoaded,
    nextPhotoAnimation,
    clearNextPhotoAnimation,
  } = useAppState();

  const prefersReducedMotion = usePrefersReducedMotion();
  
  const hasLoadedInitial = useRef(hasLoaded);
  const nextPhotoAnimationInitial = useRef(nextPhotoAnimation);

  const shouldAnimate = type !== 'none' &&
    !prefersReducedMotion &&
    !(animateOnFirstLoadOnly && hasLoadedInitial.current);
  const shouldStagger =
    !(staggerOnFirstLoadOnly && hasLoadedInitial.current);

  const typeResolved = animateFromAppState
    ? (nextPhotoAnimationInitial.current?.type ?? type)
    : type;

  const durationResolved = animateFromAppState
    ? (nextPhotoAnimationInitial.current?.duration ?? duration)
    : duration;

  const getInitialVariant = (): Variant => {
    switch (typeResolved) {
    case 'left': return {
      opacity: 0,
      transform: `translateX(${distanceOffset}px)`,
    };
    case 'right': return {
      opacity: 0,
      transform: `translateX(${-distanceOffset}px)`,
    };
    case 'bottom': return {
      opacity: 0,
      transform: `translateY(${distanceOffset}px)`,
    };
    default: return {
      opacity: 0,
      transform: `translateY(${distanceOffset}px) scale(${scaleOffset})`,
    };
    }
  };

  return (
    <motion.div
      className={className}
      initial={shouldAnimate ? 'hidden' : false}
      animate="show"
      variants={shouldStagger
        ? {
          show: {
            transition: {
              staggerChildren: staggerDelay,
            },
          },
        } : undefined}
      onAnimationComplete={() => {
        if (animateFromAppState) {
          clearNextPhotoAnimation?.();
        }
      }}
    >
      {items.map((item, index) =>
        <motion.div
          key={index}
          className={classNameItem}
          variants={{
            hidden: getInitialVariant(),
            show: {
              opacity: 1,
              transform: 'translateX(0) translateY(0) scale(1)',
            },
          }}
          transition={{
            duration: durationResolved,
            easing: 'easeOut',
          }}
        >
          {item}
        </motion.div>)}
    </motion.div>
  );
};

export default AnimateItems;
