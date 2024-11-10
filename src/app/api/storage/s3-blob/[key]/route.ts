import { auth } from '@/auth';
import { revalidateAdminPaths, revalidatePhotosKey } from '@/photo/cache';
import { NextResponse } from 'next/server';
import { awsS3Put } from '@/services/storage/aws-s3';
// import { addOverlayImageBuffer, IMAGE_WIDTH_FOR_PUBLIC, resizeImageBuffer } from '@/photo/server';

export async function PUT(request: Request,
  { params: { key } }: { params: { key: string } }): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthenticated upload');
    }

    const fileBuffer = Buffer.from(await request.arrayBuffer());
    const s3ResponsePublic = await awsS3Put(fileBuffer, key);

    revalidatePhotosKey();
    revalidateAdminPaths();

    return NextResponse.json({ url: s3ResponsePublic });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
