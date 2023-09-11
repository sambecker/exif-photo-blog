/** @type {import('next').NextConfig} */

const STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();

const nextConfig = {
  images: {
    imageSizes: [200, 400, 1050, 1200],
    remotePatterns: [{
      protocol: 'https',
      hostname: `${STORE_ID}.public.blob.vercel-storage.com`,
      port: '',
      pathname: '/**',
    }],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
