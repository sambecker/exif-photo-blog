'use client';

import { useEffect, useRef } from 'react';

const RETRY_DELAY = 2000;

export default function CanvasBlurCapture({
  imageUrl,
  onLoad,
  onCapture,
  onError,
  width,
  height,
  hidden = true,
  edgeCompensation = 10,
  scale = 0.5,
  quality = 0.9,
}: {
  imageUrl: string
  onLoad?: (imageData: string) => void
  onCapture: (imageData: string) => void
  onError?: (error: string) => void
  width: number
  height: number
  hidden?: boolean
  edgeCompensation?: number
  scale?: number
  quality?: number
}) {
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const refImage = useRef(typeof Image !== 'undefined' ? new Image() : null);
  const refTimeouts = useRef<NodeJS.Timeout[]>([]);
  const refShouldCapture = useRef(true);

  useEffect(() => {
    refShouldCapture.current = true;
  
    const capture = () => {
      if (refShouldCapture.current) {
        if (
          refCanvas.current &&
          refImage.current?.complete
        ) {
          const canvas = refCanvas.current;
          canvas.width = width * scale;
          canvas.height = height * scale;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          const context = refCanvas.current?.getContext('2d');
          if (context) {
            // Draw scaled image
            context.scale(scale, scale);
            context.drawImage(
              refImage.current,
              -edgeCompensation,
              -edgeCompensation,
              width + edgeCompensation * 2,
              width * refImage.current.height / refImage.current.width +
              edgeCompensation * 2,
            );
            onLoad?.(canvas.toDataURL('image/jpeg', quality));
            // Draw blurred image
            context.filter =
              'contrast(1.2) saturate(1.2) ' +
              `blur(${scale * 10}px)`;
            context.drawImage(
              refImage.current,
              -edgeCompensation,
              -edgeCompensation,
              width + edgeCompensation * 2,
              width * refImage.current.height / refImage.current.width +
              edgeCompensation * 2,
            );
            onCapture(canvas.toDataURL('image/jpeg', quality));
            onError?.('');
            refTimeouts.current.forEach(clearTimeout);
            refShouldCapture.current = false;
          } else {
            console.error('Cannot get 2d context ... retrying');
            onError?.('Cannot get 2d context ... retrying');
            // Retry capture in case canvas is not available
            refTimeouts.current.push(setTimeout(capture, RETRY_DELAY));
          }
        } else {
          // eslint-disable-next-line max-len
          console.error('Cannot generate blur data: canvas/image not ready ... retrying');
          // eslint-disable-next-line max-len
          onError?.('Cannot generate blur data: canvas/image not ready ... retrying');
          // Retry capture in case canvas is not available
          refTimeouts.current.push(setTimeout(capture, RETRY_DELAY));
        }
      }
    };

    if (refImage.current) {
      refImage.current.crossOrigin = 'anonymous';
      refImage.current.src = imageUrl;
      refImage.current.onload = capture;
    }

    // Attempt delayed capture in case image.onload never fires
    refTimeouts.current.push(setTimeout(capture, RETRY_DELAY));

    // Store timeout ref to ensure it's closed over
    // in cleanup function (recommended by exhaustive-deps)
    const timeouts = refTimeouts.current;
    return () => {
      refShouldCapture.current = false;
      timeouts.forEach(clearTimeout);
    };
  }, [
    imageUrl,
    onCapture,
    onLoad,
    onError,
    width,
    height,
    edgeCompensation,
    scale,
    quality,
  ]);

  return (
    <canvas ref={refCanvas} className={hidden ? 'hidden' : undefined} />
  );
}
