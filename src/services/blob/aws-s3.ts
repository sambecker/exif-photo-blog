import { generateNanoid } from '@/utility/nanoid';
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? '';
const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION ?? '';
const S3_UPLOAD_ACCESS_KEY =
  process.env.NEXT_PUBLIC_S3_UPLOAD_ACCESS_KEY ?? '';
const S3_UPLOAD_SECRET_ACCESS_KEY =
  process.env.NEXT_PUBLIC_S3_UPLOAD_SECRET_ACCESS_KEY ?? '';
const S3_ADMIN_ACCESS_KEY =
  process.env.S3_ADMIN_ACCESS_KEY;
const S3_ADMIN_SECRET_ACCESS_KEY =
  process.env.S3_ADMIN_SECRET_ACCESS_KEY;

const client = () => new S3Client({
  region: S3_REGION,
  credentials: {
    // Fall back on upload credentials when admin credentials aren't available
    accessKeyId: S3_ADMIN_ACCESS_KEY ?? S3_UPLOAD_ACCESS_KEY,
    secretAccessKey: S3_ADMIN_SECRET_ACCESS_KEY ?? S3_UPLOAD_SECRET_ACCESS_KEY,
  },
});

export const AWS_S3_BASE_URL =
  `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;

export const isUrlFromAwsS3 = (url: string) =>
  url.startsWith(AWS_S3_BASE_URL);

const urlForKey = (key?: string) => `${AWS_S3_BASE_URL}/${key}`;

const generateBlobId = () => generateNanoid(16);

export const awsS3UploadFromClient = async (
  file: File | Blob,
  fileName: string,
  extension: string,
  addRandomSuffix?: boolean,
) => {
  const Key = addRandomSuffix
    ? `${fileName}-${generateBlobId()}.${extension}`
    : `${fileName}.${extension}`;
  return client().send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key,
    Body: file,
    ACL: 'public-read',
  }))
    .then(() => urlForKey(Key));
};

export const awsS3Copy = async (
  fileNameSource: string,
  fileNameDestination: string,
  addRandomSuffix?: boolean,
) => {
  const name = fileNameSource.split('.')[0];
  const extension = fileNameSource.split('.')[1];
  const Key = addRandomSuffix
    ? `${name}-${generateBlobId()}.${extension}`
    : fileNameDestination;
  return client().send(new CopyObjectCommand({
    Bucket: S3_BUCKET,
    CopySource: fileNameSource,
    Key,
    ACL: 'public-read',
  }))
    .then(() => urlForKey(fileNameDestination));
};

export const awsS3Delete = async (Key: string) => {
  client().send(new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key,
  }));
};

export const awsS3List = async (Prefix: string) =>
  client().send(new ListObjectsCommand({
    Bucket: S3_BUCKET,
    Prefix,
  }))
    .then((data) => data.Contents?.map(({ Key }) => urlForKey(Key)) ?? []);
