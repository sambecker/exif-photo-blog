import { auth } from '@/auth';
import { revalidateAdminPaths, revalidatePhotosKey } from '@/photo/cache';
import { NextResponse } from 'next/server';
import { awsS3Put } from '@/services/storage/aws-s3';
import { IMAGE_WIDTH_FOR_PUBLIC, resizeImageBuffer } from '@/photo/server';

export async function PUT(request: Request,
  { params: { key } }: { params: { key: string } }): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthenticated upload');
    }

    const fileBuffer = Buffer.from(await request.arrayBuffer());
    
    const fileBufferPublicSize = await resizeImageBuffer(fileBuffer, IMAGE_WIDTH_FOR_PUBLIC)

    const dotIndex = key.lastIndexOf('.');

    const folderName = key.substring(0, dotIndex);
    const completeFilePathKey = `${folderName}/${key}`;
    const _ = await awsS3Put(fileBuffer, completeFilePathKey, "bucket-owner-full-control");
    const s3ResponsePublic = await awsS3Put(fileBufferPublicSize, completeFilePathKey);

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
