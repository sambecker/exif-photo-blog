import { auth } from '@/auth';
import {
  awsS3Client,
  awsS3PutObjectCommandForKey,
} from '@/services/blob/aws-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const runtime = 'edge';

export async function GET(
  _: Request,
  { params: { key } }: { params: { key: string } },
) {
  const session = await auth();
  if (session?.user && key) {
    const url = await getSignedUrl(
      awsS3Client(),
      awsS3PutObjectCommandForKey(key),
      { expiresIn: 3600 }
    );
    return new Response(
      url,
      { headers: { 'content-type': 'text/plain' } },
    );
  } else {
    return new Response('Unauthorized request', { status: 401 });
  }
}
