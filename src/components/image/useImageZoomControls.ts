import useMetaThemeColor from '@/utility/useMetaThemeColor';
import { useAppState } from '@/app/AppState';
import {
  ComponentProps,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Viewer from 'viewerjs';
import ZoomControls from './ZoomControls';
import anchorViewerZoom, { isPointerGestureActive } from './anchorViewerZoom';

export default function useImageZoomControls({
  refImageContainer,
  selectImageElement,
  isEnabled,
} : {
  refImageContainer: RefObject<HTMLElement | null>
} & Omit<ComponentProps<typeof ZoomControls>, 'ref' | 'children'>) {
  const viewerRef = useRef<Viewer | null>(null);

  const refViewerContainer = useRef<HTMLDivElement>(null);

  const { setShouldRespondToKeyboardCommands } = useAppState();

  const [zoomLevel, setZoomLevel] = useState(1);

  const [colorLight, setColorLight] = useState<string>();

  useMetaThemeColor({ colorLight });

  const open = useCallback(() =>
    viewerRef.current?.show(), []);

  const close = useCallback(() =>
    viewerRef.current?.hide(), []);

  const zoomTo = useCallback((zoomLevel = 1) =>
    viewerRef.current?.zoomTo(zoomLevel), []);

  const reset = useCallback(() => {
    setZoomLevel(1);
    viewerRef.current?.reset();
  }, []);

  useEffect(() => {
    if (isEnabled) {
      const imageRef = (
        selectImageElement?.(refImageContainer.current) ?? 
        refImageContainer.current
      );
      if (imageRef) {
        viewerRef.current = new Viewer(imageRef, {
          navbar: false,
          title: false,
          // This UI has no rotate control, and rotation makes viewer.js turn
          // the photo during a two-finger pinch
          rotatable: false,
          // viewer.js applies its 300ms transition again on every zoom and
          // every move, and it sends one of each per pointer frame. The photo
          // then arrives 300ms after the pointer. Drop the ease while a
          // gesture drives the viewer, and keep it everywhere else.
          transition: {
            move: false,
            get zoom() {
              return !isPointerGestureActive(viewerRef.current);
            },
          },
          toolbar: {
            zoomIn: 1,
            reset: 2,
            zoomOut: 3,
          },
          ready: ({ target }) => {
            refViewerContainer.current =
              (target as any).viewer.viewer as HTMLDivElement;
          },
          url: (image: HTMLImageElement) => {
            // Addresses Safari bug where images don't load
            image.loading = 'eager';
            return image.src;
          },
          show: () => {
            setShouldRespondToKeyboardCommands?.(false);
            setColorLight('#000');
          },
          hide: () => {
            // Optimizes Safari status bar animation
            setTimeout(() => setColorLight(undefined), 300);
          },
          hidden: () => {
            setShouldRespondToKeyboardCommands?.(true);
          },
          zoom: ({ detail: { ratio } }) => {
            setZoomLevel(ratio);
          },
        });
        anchorViewerZoom(viewerRef.current);
        return () => {
          viewerRef.current?.destroy();
          viewerRef.current = null;
        };
      }
    }
  }, [
    isEnabled,
    refImageContainer,
    selectImageElement,
    setShouldRespondToKeyboardCommands,
  ]);

  return {
    open,
    close,
    reset,
    zoomTo,
    zoomLevel,
    refViewerContainer,
  };
}
