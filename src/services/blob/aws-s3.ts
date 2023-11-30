import { generateNanoid } from '@/utility/nanoid';
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

const AWS_S3_BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET ?? '';
const AWS_S3_REGION = process.env.NEXT_PUBLIC_AWS_S3_REGION ?? '';
const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY ?? '';
const AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY ?? '';

const API_PATH_PRESIGNED_URL = '/api/aws-s3/presigned-url';

export const awsS3Client = () => new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
  },
});

export const AWS_S3_BASE_URL =
  `https://${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com`;

export const isUrlFromAwsS3 = (url: string) =>
  url.startsWith(AWS_S3_BASE_URL);

const urlForKey = (key?: string) => `${AWS_S3_BASE_URL}/${key}`;

const generateBlobId = () => generateNanoid(16);

export const awsS3PutObjectCommandForKey = (Key: string) =>
  new PutObjectCommand({ Bucket: AWS_S3_BUCKET, Key, ACL: 'public-read' });

export const awsS3UploadFromClient = async (
  file: File | Blob,
  fileName: string,
  extension: string,
  addRandomSuffix?: boolean,
) => {
  const key = addRandomSuffix
    ? `${fileName}-${generateBlobId()}.${extension}`
    : `${fileName}.${extension}`;

  const url = await fetch(`${API_PATH_PRESIGNED_URL}/${key}`)
    .then((response) => response.text());

  return fetch(url, { method: 'PUT', body: file })
    .then(() => urlForKey(key));
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
  return awsS3Client().send(new CopyObjectCommand({
    Bucket: AWS_S3_BUCKET,
    CopySource: fileNameSource,
    Key,
    ACL: 'public-read',
  }))
    .then(() => urlForKey(fileNameDestination));
};

export const awsS3Delete = async (Key: string) => {
  awsS3Client().send(new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key,
  }));
};

export const awsS3List = async (Prefix: string) =>
  awsS3Client().send(new ListObjectsCommand({
    Bucket: AWS_S3_BUCKET,
    Prefix,
  }))
    .then((data) => data.Contents?.map(({ Key }) => urlForKey(Key)) ?? []);
