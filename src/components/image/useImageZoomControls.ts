import { useAppState } from '@/state/AppState';
import useKeydownHandler from '@/utility/useKeydownHandler';
import { RefObject, useCallback, useEffect, useRef } from 'react';
import Viewer from 'viewerjs';

const EVENT_SHOWN = 'shown';
const EVENT_HIDDEN = 'hidden';

export default function useImageZoomControls(
  imageRef: RefObject<HTMLDivElement | null>,
  isEnabled?: boolean,
  shouldExpandOnFKeydown?: boolean,
) {
  const viewerRef = useRef<Viewer | null>(null);

  const { setShouldRespondToKeyboardCommands } = useAppState();

  useEffect(() => {
    if (imageRef.current && isEnabled) {
      viewerRef.current = new Viewer(imageRef.current, {
        inline: false,
        button: true,
        navbar: false,
        title: false,
        toolbar: {
          zoomIn: 1,
          reset: 2,
          zoomOut: 3,
        },
      });
      return () => {
        viewerRef.current?.destroy();
      };
    }
  }, [imageRef, isEnabled]);

  const open = useCallback(() => {
    viewerRef.current?.show();
  }, [viewerRef]);

  const close = useCallback(() => {
    viewerRef.current?.hide();
  }, [viewerRef]);

  // On shown, disable keyboard commands
  const onShown = useCallback(() =>
    setShouldRespondToKeyboardCommands?.(false),
  [setShouldRespondToKeyboardCommands]);
  useEffect(() => {
    const imageRefCurrent = imageRef.current;
    imageRefCurrent?.addEventListener(EVENT_SHOWN, onShown);
    return () => {
      imageRefCurrent?.removeEventListener(EVENT_SHOWN, onShown);
    };
  }, [imageRef, onShown]);

  // On hidden, reenable keyboard commands
  const onHide = useCallback(() =>
    setShouldRespondToKeyboardCommands?.(true),
  [setShouldRespondToKeyboardCommands]);
  useEffect(() => {
    const imageRefCurrent = imageRef.current;
    imageRefCurrent?.addEventListener(EVENT_HIDDEN, onHide);
    return () => {
      imageRefCurrent?.removeEventListener(EVENT_HIDDEN, onHide);
    };
  }, [imageRef, onHide]);

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
