import { auth } from '@/auth';
import { revalidateAdminPaths, revalidatePhotosKey } from '@/cache';
import { ACCEPTED_PHOTO_FILE_TYPES } from '@/photo';
import { isUploadPathnameValid } from '@/services/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth();
        if (session?.user) {
          if (isUploadPathnameValid(pathname)) {
            return {
              maximumSizeInBytes: 40_000_000,
              allowedContentTypes: ACCEPTED_PHOTO_FILE_TYPES,
            };
          } else {
            throw new Error('Invalid upload');
          }
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
