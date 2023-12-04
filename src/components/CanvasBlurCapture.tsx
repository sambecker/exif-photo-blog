'use client';

import { useEffect, useRef } from 'react';

const RETRY_DELAY = 2000;

export default function CanvasBlurCapture({
  imageUrl,
  onCapture,
  width,
  height,
  hidden = true,
  edgeCompensation = 10,
  scale = 0.5,
  quality = 0.9,
}: {
  imageUrl: string
  onCapture: (blurData: string) => void
  width: number
  height: number
  hidden?: boolean
  edgeCompensation?: number
  scale?: number
  quality?: number
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refTimeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const capture = () => {
      const canvas = refCanvas.current;
      if (canvas) {
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const context = refCanvas.current?.getContext('2d');
        if (context) {
          context.scale(scale, scale);
          context.filter =
            'contrast(1.2) saturate(1.2)' +
            `blur(${scale * 10}px)`;
          context.drawImage(
            image,
            -edgeCompensation,
            -edgeCompensation,
            width + edgeCompensation * 2,
            width * image.height / image.width + edgeCompensation * 2,
          );
          refTimeouts.current.forEach(clearTimeout);
          onCapture(canvas.toDataURL('image/jpeg', quality));
        } else {
          console.error('Cannot get 2d context');
          // Retry capture in case canvas is not available
          refTimeouts.current.push(setTimeout(capture, RETRY_DELAY));
        }
      } else {
        console.error('Cannot generate blur data: canvas not found');
        // Retry capture in case canvas is not available
        refTimeouts.current.push(setTimeout(capture, RETRY_DELAY));
      }
    };

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;
    image.onload = capture;

    // Attempt delayed capture in case image.onload never fires
    refTimeouts.current.push(setTimeout(capture, RETRY_DELAY));

    // Store timeout ref to ensure it's closed over
    // in cleanup function (recommended by exhaustive-deps)
    const timeouts = refTimeouts.current;
    return () => timeouts.forEach(clearTimeout);
  }, [
    imageUrl,
    onCapture,
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
