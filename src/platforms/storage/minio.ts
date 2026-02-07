import {
  S3Client,
  CopyObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { StorageListResponse, generateStorageId } from '.';
import { formatBytes } from '@/utility/number';

const MINIO_BUCKET = process.env.NEXT_PUBLIC_MINIO_BUCKET ?? '';
const MINIO_DOMAIN = process.env.NEXT_PUBLIC_MINIO_DOMAIN ?? '';
const MINIO_PORT = process.env.NEXT_PUBLIC_MINIO_PORT ?? '';
const MINIO_DISABLE_SSL = process.env.NEXT_PUBLIC_MINIO_DISABLE_SSL === '1';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY ?? '';
const MINIO_SECRET_ACCESS_KEY = process.env.MINIO_SECRET_ACCESS_KEY ?? '';

const PROTOCOL = MINIO_DISABLE_SSL ? 'http' : 'https';
const ENDPOINT = MINIO_BUCKET && MINIO_DOMAIN
  ? `${PROTOCOL}://${MINIO_DOMAIN}${MINIO_PORT ? `:${MINIO_PORT}` : ''}`
  : undefined;

export const MINIO_BASE_URL = ENDPOINT
  ? `${ENDPOINT}/${MINIO_BUCKET}`
  : undefined;

export const minioClient = () => new S3Client({
  region: 'us-east-1',
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const urlForKey = (key?: string) => `${MINIO_BASE_URL}/${key}`;

export const isUrlFromMinio = (url?: string) =>
  MINIO_BASE_URL && url?.startsWith(MINIO_BASE_URL);

export const minioPutObjectCommandForKey = (Key: string) =>
  new PutObjectCommand({ Bucket: MINIO_BUCKET, Key });

export const minioPut = async (
  file: Buffer,
  fileName: string,
): Promise<string> =>
  minioClient().send(new PutObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: fileName,
    Body: file,
  }))
    .then(() => urlForKey(fileName));

export const minioCopy = async (
  fileNameSource: string,
  fileNameDestination: string,
  addRandomSuffix?: boolean,
) => {
  const name = fileNameSource.split('.')[0];
  const extension = fileNameSource.split('.')[1];
  const Key = addRandomSuffix
    ? `${name}-${generateStorageId()}.${extension}`
    : fileNameDestination;
  return minioClient().send(new CopyObjectCommand({
    Bucket: MINIO_BUCKET,
    // Bucket behavior seems to differ from R2 + S3
    CopySource: `${MINIO_BUCKET}/${fileNameSource}`,
    Key,
  }))
    .then(() => urlForKey(Key));
};

export const minioList = async (
  Prefix: string,
): Promise<StorageListResponse> =>
  minioClient().send(new ListObjectsCommand({
    Bucket: MINIO_BUCKET,
    Prefix,
  }))
    .then((data) => data.Contents?.map(({ Key, LastModified, Size }) => ({
      url: urlForKey(Key),
      fileName: Key ?? '',
      uploadedAt: LastModified,
      size: Size ? formatBytes(Size) : undefined,
    })) ?? []);

export const minioDelete = async (Key: string): Promise<void> => {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: MINIO_BUCKET,
    Key,
  });
  await minioClient().send(deleteObjectCommand);
};
