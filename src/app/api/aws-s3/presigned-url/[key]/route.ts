import { auth } from '@/auth';
import { awsS3GetSignedUploadUrl } from '@/services/blob/aws-s3';

export const runtime = 'edge';

export async function GET(
  _: Request,
  { params: { key } }: { params: { key: string } },
) {
  const session = await auth();
  if (session?.user && key) {
    const url = await awsS3GetSignedUploadUrl(key);
    return new Response(
      url,
      { headers: { 'content-type': 'text/plain' } },
    );
  } else {
    return new Response('Unauthorized request', { status: 401 });
  }
}
