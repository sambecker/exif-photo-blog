import { APP_CONFIGURATION, DEBUG_OUTPUTS_ENABLED } from '@/app/config';

export async function GET() {
  return DEBUG_OUTPUTS_ENABLED
    ? Response.json(APP_CONFIGURATION)
    : new Response('Debugging disabled', { status: 404 });
};
