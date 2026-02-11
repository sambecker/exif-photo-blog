import { auth } from '@/auth/server';
import { revalidateAdminPaths, revalidatePhotosKey } from '@/cache';
import {
  ACCEPTED_PHOTO_FILE_TYPES,
  MAX_PHOTO_UPLOAD_SIZE_IN_BYTES,
} from '@/photo';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body: HandleUploadBody = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (session?.user) {
          return {
            maximumSizeInBytes: MAX_PHOTO_UPLOAD_SIZE_IN_BYTES,
            allowedContentTypes: ACCEPTED_PHOTO_FILE_TYPES,
          };
        } else {
          throw new Error('Unauthenticated upload');
        }
      },
      // This argument is required, but doesn't seem to fire
      onUploadCompleted: async () => {
        revalidatePhotosKey();
        revalidateAdminPaths();
      },
    });
    revalidatePhotosKey();
    revalidateAdminPaths();
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
