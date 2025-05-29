import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PATH_ADMIN_CONFIGURATION } from '@/app/paths';
import AdminContainer from '@/admin/AdminContainer';
import PerformanceMonitor from './PerformanceMonitor';

export const metadata: Metadata = {
  title: 'Admin: Performance',
};

export default async function PerformancePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect(PATH_ADMIN_CONFIGURATION);
  }

  return (
    <AdminContainer>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Performance Monitoring</h1>
        <PerformanceMonitor />
      </div>
    </AdminContainer>
  );
}