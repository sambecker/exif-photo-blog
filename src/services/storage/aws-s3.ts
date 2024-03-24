import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { StorageListResponse, generateStorageId } from '.';

const AWS_S3_BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET ?? '';
const AWS_S3_REGION = process.env.NEXT_PUBLIC_AWS_S3_REGION ?? '';
const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY ?? '';
const AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY ?? '';

export const AWS_S3_BASE_URL = AWS_S3_BUCKET && AWS_S3_REGION
  ? `https://${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com`
  : undefined;

export const awsS3Client = () => new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
  },
});

const urlForKey = (key?: string) => `${AWS_S3_BASE_URL}/${key}`;

export const isUrlFromAwsS3 = (url?: string) =>
  AWS_S3_BASE_URL && url?.startsWith(AWS_S3_BASE_URL);

export const awsS3PutObjectCommandForKey = (Key: string) =>
  new PutObjectCommand({ Bucket: AWS_S3_BUCKET, Key, ACL: 'public-read' });

export const awsS3Copy = async (
  fileNameSource: string,
  fileNameDestination: string,
  addRandomSuffix?: boolean,
) => {
  const name = fileNameSource.split('.')[0];
  const extension = fileNameSource.split('.')[1];
  const Key = addRandomSuffix
    ? `${name}-${generateStorageId()}.${extension}`
    : fileNameDestination;
  return awsS3Client().send(new CopyObjectCommand({
    Bucket: AWS_S3_BUCKET,
    CopySource: fileNameSource,
    Key,
    ACL: 'public-read',
  }))
    .then(() => urlForKey(fileNameDestination));
};

export const awsS3List = async (
  Prefix: string,
): Promise<StorageListResponse> =>
  awsS3Client().send(new ListObjectsCommand({
    Bucket: AWS_S3_BUCKET,
    Prefix,
  }))
    .then((data) => data.Contents?.map(({ Key, LastModified }) => ({
      url: urlForKey(Key),
      uploadedAt: LastModified,
    })) ?? []);

export const awsS3Delete = async (Key: string) => {
  awsS3Client().send(new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key,
  }));
};
