import { auth } from '@/auth/server';
import { getSignedUrl } from '@/platforms/storage';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  const session = await auth();
  
  if (session?.user && key) {    
    const url = await getSignedUrl(key, 'PUT');
    return new Response(
      url,
      { headers: { 'content-type': 'text/plain' } },
    );
  } else {
    return new Response('Unauthorized request', { status: 401 });
  }
}
