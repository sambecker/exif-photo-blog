'use client';

import { useEffect, RefObject } from 'react';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/state/AppState';
import LoaderButton from './primitives/LoaderButton';

export default function FullscreenButton({
  className,
  imageRef,
}: {
  className?: string;
  imageRef: RefObject<HTMLImageElement | null>;
}) {
  const { isFullscreen, setIsFullscreen } = useAppState();

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await imageRef.current?.requestFullscreen();
      setIsFullscreen && setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen && setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFullscreen]);

  return (
    <LoaderButton
      title="Toggle Fullscreen"
      className={clsx(
        className,
        'text-medium absolute bottom-2 right-2 bg-white p-2 rounded'
      )}
      icon={isFullscreen ? <MdFullscreenExit size={18} /> : <MdFullscreen size={18} />}
      spinnerColor='light-gray'
      styleAs='link'
      onClick={toggleFullscreen}
    />
  );
}
