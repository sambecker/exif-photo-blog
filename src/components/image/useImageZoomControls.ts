import useMetaThemeColor from '@/site/useMetaThemeColor';
import { useAppState } from '@/state/AppState';
import useKeydownHandler from '@/utility/useKeydownHandler';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import Viewer from 'viewerjs';

export default function useImageZoomControls(
  imageRef: RefObject<HTMLDivElement | null>,
  isEnabled?: boolean,
  shouldExpandOnFKeydown?: boolean,
) {
  const viewerRef = useRef<Viewer | null>(null);

  const { setShouldRespondToKeyboardCommands } = useAppState();

  const [colorLight, setColorLight] = useState<string>();

  useMetaThemeColor({ colorLight });

  useEffect(() => {
    if (imageRef.current && isEnabled) {
      viewerRef.current = new Viewer(imageRef.current, {
        navbar: false,
        title: false,
        toolbar: {
          zoomIn: 1,
          reset: 2,
          zoomOut: 3,
        },
        url: (image: HTMLImageElement) => {
          image.loading = 'eager';
          return image.src;
        },
        show: () => {
          setShouldRespondToKeyboardCommands?.(false);
          setColorLight('#000');
        },
        hide: () => {
          setTimeout(() => setColorLight(undefined), 300);
        },
        hidden: () => {
          setShouldRespondToKeyboardCommands?.(true);
        },
      });
      return () => {
        viewerRef.current?.destroy();
        viewerRef.current = null;
      };
    }
  }, [imageRef, isEnabled, setShouldRespondToKeyboardCommands]);

  const open = useCallback(() => {
    viewerRef.current?.show();
  }, [viewerRef]);

  const close = useCallback(() => {
    viewerRef.current?.hide();
  }, [viewerRef]);

  // On 'F' keydown, toggle fullscreen
  const handleKeyDown = useCallback(() => {
    if (shouldExpandOnFKeydown) {
      viewerRef.current?.show();
    }
  }, [shouldExpandOnFKeydown]);
  useKeydownHandler(handleKeyDown, ['F']);

  return {
    open,
    close,
  };
}
