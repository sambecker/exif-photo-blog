import HttpStatusPage from '@/components/HttpStatusPage';

interface UnauthorizedPageProps {
  searchParams: Promise<{
    reason?: string;
    error?: string;
  }>;
}

export default async function UnauthorizedPage({
  searchParams,
}: UnauthorizedPageProps) {
  const { reason, error } = await searchParams;

  const errorMessage = reason || error || 'Access denied';

  return (
    <HttpStatusPage status="401">
      <div className="space-y-2">
        <p className="text-lg font-medium">Unauthorized Access</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {errorMessage || 'Access denied'}
        </p>
      </div>
    </HttpStatusPage>
  );
}
