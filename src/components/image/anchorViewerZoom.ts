import type Viewer from 'viewerjs';

// viewer.js anchors a zoom with internal fields that its published types do
// not include. This module reads the fields that follow.

type ViewerPointer = {
  startX: number
  startY: number
  endX: number
  endY: number
};

type ViewerInternals = {
  action: string | false
  actionEvent: (Event & Partial<Pick<MouseEvent, 'pageX' | 'pageY'>>) | null
  gesturing: boolean
  pointers: Record<string, ViewerPointer>
  imageData: Record<'x' | 'y' | 'width' | 'height', number>
  viewerData: Record<'width' | 'height', number>
  change: (event: Event) => void
};

// viewer.js labels a two-finger gesture 'transform' in 1.15 and later,
// and 'zoom' in earlier versions
const isPinching = ({ action }: ViewerInternals) =>
  action === 'transform' || action === 'zoom';

// A zoom anchor needs pointer coordinates. A click carries them, but they
// give the position of the button, not the position of the photo.
const canAnchorZoom = (event: ViewerInternals['actionEvent']) =>
  event?.type !== 'click' &&
  Number.isFinite(event?.pageX) &&
  Number.isFinite(event?.pageY);

const getPointersCenter = (pointers: ViewerInternals['pointers']) => {
  const points = Object.values(pointers);
  return points.length > 0
    ? {
      x: points.reduce((sum, { startX }) => sum + startX, 0) / points.length,
      y: points.reduce((sum, { startY }) => sum + startY, 0) / points.length,
    }
    : undefined;
};

const clampToViewer = (value: number, max: number) =>
  Math.min(Math.max(value, 0), max);

// The center of the part of the photo that is on screen. This is the center
// of the photo while the photo fits, and the center of the viewport once the
// photo is larger. viewer.js puts no bounds on a pan, so both edges clamp to
// the viewport. A photo that is fully off screen then zooms toward the edge
// that it left, not further away.
const getVisibleCenter = ({ imageData, viewerData }: ViewerInternals) => {
  const { x, y, width, height } = imageData;
  return Number.isFinite(x) && Number.isFinite(y)
    ? {
      x: (
        clampToViewer(x, viewerData.width) +
        clampToViewer(x + width, viewerData.width)
      ) / 2,
      y: (
        clampToViewer(y, viewerData.height) +
        clampToViewer(y + height, viewerData.height)
      ) / 2,
    }
    : undefined;
};

// True while a pointer or a Safari gesture drives the viewer. viewer.js reads
// `transition.zoom` on every zoom, so a zoom during a gesture can skip the
// ease and land in the same frame as the fingers. Every other zoom keeps the
// ease, and `hide()` needs it: the viewer stays open until the photo reports
// a `transitionend`.
export const isPointerGestureActive = (viewer: Viewer | null): boolean => {
  if (!viewer) { return false; }
  const { action, gesturing } = viewer as unknown as ViewerInternals;
  return action !== false || gesturing;
};

export default function anchorViewerZoom(viewer: Viewer): void {
  // viewer.js publishes no type for the state above, so this cast is the only
  // way to reach it
  const internals = viewer as unknown as ViewerInternals;
  const { zoomTo } = viewer;
  const { change } = internals;

  viewer.zoomTo = (ratio, hasTooltip, pivot) => {
    // viewer.js anchors a zoom on the event that started it. But viewer.js
    // stores an event for every keydown, and the arrow keys zoom. A keydown
    // carries no pageX/pageY, so the anchor math gives NaN and the photo
    // grows out of its top-left corner from then on.
    if (!canAnchorZoom(internals.actionEvent)) {
      internals.actionEvent = null;
    }
    return zoomTo.call(
      viewer,
      ratio,
      hasTooltip,
      pivot ?? getVisibleCenter(internals),
    );
  };

  internals.change = event => {
    if (!isPinching(internals)) {
      change.call(viewer, event);
      return;
    }

    const centerBefore = getPointersCenter(internals.pointers);

    if (internals.gesturing) {
      // Safari sends its own `gesturechange` events together with the pointer
      // moves. A zoom on both scales twice as fast as the fingers move. The
      // pointers advance here, the way viewer.js advances them itself, so the
      // pan that follows still gets the true delta.
      Object.values(internals.pointers).forEach(pointer => {
        pointer.startX = pointer.endX;
        pointer.startY = pointer.endY;
      });
    } else {
      change.call(viewer, event);
    }

    // viewer.js only scales during a pinch. The photo also translates here,
    // so the photo stays under the fingers.
    const centerAfter = getPointersCenter(internals.pointers);
    if (centerBefore && centerAfter) {
      viewer.move(
        centerAfter.x - centerBefore.x,
        centerAfter.y - centerBefore.y,
      );
    }
  };
}
