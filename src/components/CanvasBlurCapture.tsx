'use client';

import { useEffect, useRef } from 'react';

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
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;
    image.onload = () => {
      timeout = setTimeout(() => {
        const canvas = ref.current;
        if (canvas) {
          canvas.width = width * scale;
          canvas.height = height * scale;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          const context = ref.current?.getContext('2d');
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
              width * image.height / image.width
                + edgeCompensation * 2,
            );
            onCapture(canvas.toDataURL('image/jpeg', quality));
          }
        } else {
          console.error('Cannot generate blur data: canvas not found');
        }
      }, 2000);
    };

    return () => clearTimeout(timeout);
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
    <canvas ref={ref} className={hidden ? 'hidden' : undefined} />
  );
}
