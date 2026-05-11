/* eslint-disable max-len */
'use client';

// Custom image loader for self-hosted imgproxy
// This is used when NEXT_PUBLIC_IMAGE_LOADER is set to 'imgproxy'

export default function imgproxyLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';

  // Get imgproxy URL from environment
  const imgproxyUrl =
    process.env.NEXT_PUBLIC_IMGPROXY_URL || 'http://localhost:8080';

  // If in dev mode and image is local (doesn't start with http), return as-is
  // This allows local development without imgproxy for local images
  const isLocal = !src.startsWith('http');
  if (isDev && isLocal) {
    return src;
  }

  // Build imgproxy URL
  // imgproxy format: /insecure/{resize}/{width}/{height}/{gravity}/{enlarge}/{encoded_url}.{format}
  // For simple resizing: /insecure/rs:fit:{width}:{height}/plain/{url}@{quality}

  const q = quality || 75;
  const w = width || 200;

  // Use plain URL format with URL encoding instead of base64
  // This works in both Node.js and browser environments

  // If running in docker-compose, imgproxy needs to fetch from the minio container,
  // not from its own isolated localhost.
  const resolvedSrc =
    isDev && src.startsWith('http://localhost:9000')
      ? src.replace('http://localhost:9000', 'http://minio:9000')
      : src;

  const encodedUrl = encodeURIComponent(resolvedSrc);

  // Use imgproxy's plain URL format
  // /insecure/rs:fit:{w}:0/q:{quality}/plain/{encoded_url}
  return `${imgproxyUrl}/insecure/rs:fit:${w}:0/q:${q}/plain/${encodedUrl}`;
}
