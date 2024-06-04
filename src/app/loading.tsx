//约定大于配置,如果page.tsx的return之前有await，则会显示loading
export default function Loading() {
	return <div>loading...</div>;
	// return <DashboardSkeleton />;
}
