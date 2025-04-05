import { auth } from '@/auth/server';
import {
  awsS3Client,
  awsS3PutObjectCommandForKey,
} from '@/platforms/storage/aws-s3';
import {
  cloudflareR2Client,
  cloudflareR2PutObjectCommandForKey,
} from '@/platforms/storage/cloudflare-r2';
import { CURRENT_STORAGE } from '@/app/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  const session = await auth();
  if (session?.user && key) {
    const url = await getSignedUrl(
      CURRENT_STORAGE === 'cloudflare-r2'
        ? cloudflareR2Client()
        : awsS3Client(),
      CURRENT_STORAGE === 'cloudflare-r2'
        ? cloudflareR2PutObjectCommandForKey(key)
        : awsS3PutObjectCommandForKey(key),
      { expiresIn: 3600 },
    );
    return new Response(
      url,
      { headers: { 'content-type': 'text/plain' } },
    );
  } else {
    return new Response('Unauthorized request', { status: 401 });
  }
}
