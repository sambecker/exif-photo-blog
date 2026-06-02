const path = require('path');

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

const removeUrlProtocol = (url) => {
  if (!url) return url;
  return url.replace(/^(https?:\/\/)/, '');
};

const generateRemotePattern = (hostname) =>
({
  protocol: 'https',
  hostname: removeUrlProtocol(hostname),
  port: '',
  pathname: '/**',
});

const remotePatterns = [];

if (HOSTNAME_VERCEL_BLOB) {
  remotePatterns.push(generateRemotePattern(HOSTNAME_VERCEL_BLOB));
}
if (HOSTNAME_CLOUDFLARE_R2) {
  remotePatterns.push(generateRemotePattern(HOSTNAME_CLOUDFLARE_R2));
}
if (HOSTNAME_AWS_S3) {
  remotePatterns.push(generateRemotePattern(HOSTNAME_AWS_S3));
}

const LOCALE = process.env.NEXT_PUBLIC_LOCALE || 'en-us';
const LOCALE_ALIAS = './date-fns-locale-alias';
const LOCALE_DYNAMIC = `i18n/locales/${LOCALE}`;

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 48, 96, 200, 384],
    remotePatterns,
    minimumCacheTTL: 31536000,
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
