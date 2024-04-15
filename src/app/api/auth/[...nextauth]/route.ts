import { SHOULD_USE_EDGE_RUNTIME } from '@/site/config';

export { GET, POST } from '@/auth';

export let runtime: 'edge' | 'nodejs';
if (SHOULD_USE_EDGE_RUNTIME) { runtime = 'edge'; }
