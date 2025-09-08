import { removeUrlProtocol } from '@/utility/url';
import type { NextConfig } from 'next';
import { RemotePattern } from 'next/dist/shared/lib/image-config';
import path from 'path';

const VERCEL_BLOB_STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();

const HOSTNAME_VERCEL_BLOB = VERCEL_BLOB_STORE_ID
  ? `${VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com`
  : undefined;

const HOSTNAME_CLOUDFLARE_R2 =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN;

const HOSTNAME_AWS_S3 =
  process.env.NEXT_PUBLIC_AWS_S3_BUCKET &&
  process.env.NEXT_PUBLIC_AWS_S3_REGION
    // eslint-disable-next-line max-len
    ? `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com`
    : undefined;

const HOSTNAME_MINIO =
  process.env.NEXT_PUBLIC_MINIO_DOMAIN;
const MINIO_PORT =
  process.env.NEXT_PUBLIC_MINIO_PORT;
const MINIO_USE_SSL =
  process.env.NEXT_PUBLIC_MINIO_DISABLE_SSL !== '1';

const generateRemotePattern = (
  hostname: string,
  port?: string,
  useSSL = true,
): RemotePattern => ({
  protocol: useSSL ? 'https' : 'http',
  hostname: removeUrlProtocol(hostname)!,
  port,
  pathname: '/**',
});

const remotePatterns: RemotePattern[] = [];

if (HOSTNAME_VERCEL_BLOB) {
  remotePatterns.push(generateRemotePattern(HOSTNAME_VERCEL_BLOB));
}
if (HOSTNAME_CLOUDFLARE_R2) {
  remotePatterns.push(generateRemotePattern(HOSTNAME_CLOUDFLARE_R2));
}
if (HOSTNAME_AWS_S3) {
  remotePatterns.push(generateRemotePattern(HOSTNAME_AWS_S3));
}
if (HOSTNAME_MINIO) {
  remotePatterns.push(generateRemotePattern(
    HOSTNAME_MINIO,
    MINIO_PORT,
    MINIO_USE_SSL,
  ));
}

const LOCALE = process.env.NEXT_PUBLIC_LOCALE || 'en-us';
const LOCALE_ALIAS = './date-fns-locale-alias';
const LOCALE_DYNAMIC = `i18n/locales/${LOCALE}`;

const IMAGE_QUALITY =
  process.env.NEXT_PUBLIC_IMAGE_QUALITY
    ? parseInt(process.env.NEXT_PUBLIC_IMAGE_QUALITY)
    : 75;

const nextConfig: NextConfig = {
  images: {
    imageSizes: [200],
    qualities: [75, IMAGE_QUALITY],
    remotePatterns,
    minimumCacheTTL: 31536000,
  },
  turbopack: {
    resolveAlias: {
      [LOCALE_ALIAS]: `@/${LOCALE_DYNAMIC}`,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      [LOCALE_ALIAS]: path.resolve(__dirname, `src/${LOCALE_DYNAMIC}`),
    };
    return config;
  },
};

module.exports = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')()(nextConfig)
  : nextConfig;
