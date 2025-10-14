import { APP_CONFIGURATION } from '@/app/config';

export async function GET() {
  return Response.json(APP_CONFIGURATION);
};
