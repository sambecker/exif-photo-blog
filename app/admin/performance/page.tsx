import { Metadata } from 'next';
import AdminInfoPage from '@/admin/AdminInfoPage';
import PerformanceMonitor from './PerformanceMonitor';

export const metadata: Metadata = {
  title: 'Admin: Performance',
};

export default function PerformancePage() {
  return (
    <AdminInfoPage>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Performance Monitoring</h1>
        <PerformanceMonitor />
      </div>
    </AdminInfoPage>
  );
}