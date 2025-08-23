import {
  S3Client,
  CopyObjectCommand,
  ListObjectsCommand,
  PutObjectCommand, DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { StorageListResponse, generateStorageId } from '.';
import { formatBytesToMB } from '@/utility/number';

const MINIO_BUCKET = process.env.NEXT_PUBLIC_MINIO_BUCKET ?? '';
const MINIO_ENDPOINT = process.env.NEXT_PUBLIC_MINIO_ENDPOINT ?? '';
const MINIO_PORT = process.env.NEXT_PUBLIC_MINIO_PORT ?? '';
const MINIO_USE_SSL = process.env.NEXT_PUBLIC_MINIO_USE_SSL === 'true';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY ?? '';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY ?? '';

export const MINIO_BASE_URL = MINIO_BUCKET && MINIO_ENDPOINT
  ? `${MINIO_USE_SSL ? 'https' : 'http'}://${MINIO_ENDPOINT}${
    MINIO_PORT ? `:${MINIO_PORT}` : ''
  }/${MINIO_BUCKET}`
  : undefined;

export const minioClient = () => new S3Client({
  region: 'us-east-1',
  endpoint: `${MINIO_USE_SSL ? 'https' : 'http'}://${MINIO_ENDPOINT}${
    MINIO_PORT ? `:${MINIO_PORT}` : ''
  }`,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
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
    CopySource: fileNameSource,
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
      size: Size ? formatBytesToMB(Size) : undefined,
    })) ?? []);

export const minioDelete = async (url: string): Promise<void> => {
  const Key = isUrlFromMinio(url)
    ? url.replace(`${MINIO_BASE_URL}/`, '')
    : url;

  const deleteObjectsCommand = new DeleteObjectsCommand({
    Bucket: MINIO_BUCKET,
    Delete: { Objects: [{Key}] },
  });
  await minioClient().send(deleteObjectsCommand);
};
