'use client';

import { useEffect, useCallback, RefObject } from 'react';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/state/AppState';
import LoaderButton from './primitives/LoaderButton';

export default function FullscreenButton({
  className,
  imageRef,
}: {
  className?: string;
  imageRef: RefObject<HTMLDivElement | null>;
}) {
  const { isFullscreen, setIsFullscreen, isCommandKOpen } = useAppState();

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      if (isCommandKOpen) return;
      await imageRef.current?.requestFullscreen();
      setIsFullscreen?.(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen?.(false);
    }
  }, [imageRef, setIsFullscreen, isCommandKOpen]);

  // Toggle fullscreen on 'f' key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'f' || event.key === 'F') {
      toggleFullscreen();
    }
  }, [toggleFullscreen]);

  // Handle fullscreen change (e.g, switching tabs in fullscreen mode)
  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement) {
      setIsFullscreen?.(false);
    }
  }, [setIsFullscreen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleKeyDown, handleFullscreenChange]);

  return (
    <LoaderButton
      title="Toggle Fullscreen"
      className={clsx(
        className,
        'text-medium absolute bottom-2 right-2 bg-white p-2 rounded',
        'hidden md:block',
      )}
      icon={isFullscreen ? <MdFullscreenExit size={18} />
        : <MdFullscreen size={18} />}
      spinnerColor="light-gray"
      styleAs="link"
      onClick={toggleFullscreen}
    />
  );
}
