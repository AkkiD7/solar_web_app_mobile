import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { useApiQuery } from '@/features/shared/hooks/use-api-query';
import { LoadingState } from '@/features/shared/components/loading-state';
import { EmptyState } from '@/features/shared/components/empty-state';
import { PageHeader } from '@/features/shared/components/page-header';
import { fetchStats } from './api';
import { StatsOverview } from './components/stats-overview';
import { PlanBreakdownChart } from './components/plan-breakdown-chart';
import { RevenueTrendChart } from './components/revenue-trend-chart';
import { RecentActivity } from './components/recent-activity';

export function DashboardPage() {
  const { token } = useSuperAdminAuth();

  const { data: stats, loading, reload } = useApiQuery(
    () => fetchStats(token!),
    [token],
    'Failed to load dashboard'
  );

  if (loading && !stats) return <LoadingState rows={6} />;
  if (!stats) return <EmptyState title="Dashboard data is unavailable." />;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Platform totals, plan distribution, and recent lead activity."
        actions={
          <Button variant="outline" onClick={reload}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        }
      />

      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gap">
        <div className="lg:col-span-3">
          <PlanBreakdownChart planBreakdown={stats.planBreakdown} />
        </div>
        <div className="lg:col-span-5">
          <RevenueTrendChart recentLeads={stats.recentLeads} />
        </div>
        <div className="lg:col-span-4">
          <RecentActivity recentLeads={stats.recentLeads} />
        </div>
      </div>
    </>
  );
}
