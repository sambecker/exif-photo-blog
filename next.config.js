const VERCEL_BLOB_STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();
const VERCEL_BLOB_HOSTNAME = VERCEL_BLOB_STORE_ID
  ? `${VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com`
  : undefined;

const AWS_S3_HOSTNAME =
  process.env.NEXT_PUBLIC_S3_BUCKET &&
  process.env.NEXT_PUBLIC_S3_REGION
    // eslint-disable-next-line max-len
    ? `${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com`
    : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    imageSizes: [200],
    remotePatterns: []
      .concat(VERCEL_BLOB_HOSTNAME ? {
        protocol: 'https',
        hostname: VERCEL_BLOB_HOSTNAME,
        port: '',
        pathname: '/**',
      } : [])
      .concat(AWS_S3_HOSTNAME ? {
        protocol: 'https',
        hostname: AWS_S3_HOSTNAME,
        port: '',
        pathname: '/**',
      } : []),
    minimumCacheTTL: 31536000,
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
