import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const CLOUDFLARE_R2_BUCKET =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET ?? '';
const CLOUDFLARE_R2_ACCOUNT_ID =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCOUNT_ID ?? '';
const CLOUDFLARE_R2_DEV_SUBDOMAIN =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_DEV_SUBDOMAIN ?? '';
const CLOUDFLARE_R2_ACCESS_KEY =
  process.env.CLOUDFLARE_R2_ACCESS_KEY ?? '';
const CLOUDFLARE_R2_SECRET_ACCESS_KEY =
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? '';
const CLOUDFLARE_R2_ENDPOINT =
  `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

export const CLOUDFLARE_R2_BASE_URL_PRIVATE =
  `${CLOUDFLARE_R2_ENDPOINT}/${CLOUDFLARE_R2_BUCKET}`;

export const CLOUDFLARE_R2_BASE_URL_PUBLIC =
  `https://${CLOUDFLARE_R2_DEV_SUBDOMAIN}.r2.dev`;

export const cloudflareR2Client = () => new S3Client({
  region: 'auto',
  endpoint: CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export const cloudflareR2PutObjectCommandForKey = (Key: string) =>
  new PutObjectCommand({ Bucket: CLOUDFLARE_R2_BUCKET, Key });
