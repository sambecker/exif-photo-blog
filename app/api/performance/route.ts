import { NextResponse } from 'next/server';
import { performanceMonitor } from '@/utility/performance';
import { auth } from '@/auth/server';

export async function GET() {
  // Only allow authenticated admin users
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const metrics = performanceMonitor.getMetrics();
  const dbMetrics = null; // await performanceMonitor.logDatabaseMetrics();

  return NextResponse.json({
    performance: metrics,
    database: dbMetrics,
    timestamp: new Date().toISOString(),
  });
}