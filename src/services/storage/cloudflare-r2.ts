import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { StorageListResponse, generateStorageId } from '.';

const CLOUDFLARE_R2_BUCKET =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET ?? '';
const CLOUDFLARE_R2_ACCOUNT_ID =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCOUNT_ID ?? '';
const CLOUDFLARE_R2_PUBLIC_DOMAIN =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN ?? '';
const CLOUDFLARE_R2_ACCESS_KEY =
  process.env.CLOUDFLARE_R2_ACCESS_KEY ?? '';
const CLOUDFLARE_R2_SECRET_ACCESS_KEY =
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? '';
const CLOUDFLARE_R2_ENDPOINT = CLOUDFLARE_R2_ACCOUNT_ID
  ? `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  : undefined;

export const CLOUDFLARE_R2_BASE_URL_PUBLIC = CLOUDFLARE_R2_PUBLIC_DOMAIN
  ? `https://${CLOUDFLARE_R2_PUBLIC_DOMAIN}`
  : undefined;
export const CLOUDFLARE_R2_BASE_URL_PRIVATE =
  CLOUDFLARE_R2_ENDPOINT && CLOUDFLARE_R2_BUCKET
    ? `${CLOUDFLARE_R2_ENDPOINT}/${CLOUDFLARE_R2_BUCKET}`
    : undefined;

export const cloudflareR2Client = () => new S3Client({
  region: 'auto',
  endpoint: CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const urlForKey = (key?: string, isPublic = true) => isPublic
  ? `${CLOUDFLARE_R2_BASE_URL_PUBLIC}/${key}`
  : `${CLOUDFLARE_R2_BASE_URL_PRIVATE}/${key}`;

export const isUrlFromCloudflareR2 = (url?: string) => (
  CLOUDFLARE_R2_BASE_URL_PRIVATE &&
  url?.startsWith(CLOUDFLARE_R2_BASE_URL_PRIVATE)
) || (
  CLOUDFLARE_R2_BASE_URL_PUBLIC &&
  url?.startsWith(CLOUDFLARE_R2_BASE_URL_PUBLIC)
);

export const cloudflareR2PutObjectCommandForKey = (Key: string) =>
  new PutObjectCommand({ Bucket: CLOUDFLARE_R2_BUCKET, Key });

export const cloudflareR2Copy = async (
  fileNameSource: string,
  fileNameDestination: string,
  addRandomSuffix?: boolean,
) => {
  const name = fileNameSource.split('.')[0];
  const extension = fileNameSource.split('.')[1];
  const Key = addRandomSuffix
    ? `${name}-${generateStorageId()}.${extension}`
    : fileNameDestination;
  return cloudflareR2Client().send(new CopyObjectCommand({
    Bucket: CLOUDFLARE_R2_BUCKET,
    CopySource: `${CLOUDFLARE_R2_BUCKET}/${fileNameSource}`,
    Key,
  }))
    .then(() => urlForKey(fileNameDestination));
};

export const cloudflareR2List = async (
  Prefix: string,
): Promise<StorageListResponse> =>
  cloudflareR2Client().send(new ListObjectsCommand({
    Bucket: CLOUDFLARE_R2_BUCKET,
    Prefix,
  }))
    .then((data) => data.Contents?.map(({ Key, LastModified }) => ({
      url: urlForKey(Key),
      uploadedAt: LastModified,
    })) ?? []);

export const cloudflareR2Delete = async (Key: string) => {
  cloudflareR2Client().send(new DeleteObjectCommand({
    Bucket: CLOUDFLARE_R2_BUCKET,
    Key,
  }));
};
