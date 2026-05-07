import { ArrowDownToLine, BarChart3, Building2, RefreshCw, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getErrorMessage, superAdminApi } from '../api';
import { useSuperAdminAuth } from '../auth';
import { EmptyState, LoadingState, PageHeader, StatCard } from '../components/common';
import type { GlobalStats } from '../types';
import { PLANS } from '../types';
import { formatCurrency, formatDate } from '../utils';

export function DashboardPage() {
  const { token } = useSuperAdminAuth();
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setStats(await superAdminApi.stats(token));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load dashboard'));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !stats) {
    return <LoadingState rows={6} />;
  }

  if (!stats) {
    return <EmptyState title="Dashboard data is unavailable." />;
  }

  const planTotal = PLANS.reduce((sum, plan) => sum + (stats.planBreakdown?.[plan] ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Platform totals, plan distribution, and recent lead activity."
        actions={
          <Button variant="outline" onClick={load}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Companies" value={stats.totalCompanies} icon={Building2} tone="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200" />
        <StatCard label="Active Companies" value={stats.activeCompanies} icon={Users} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200" />
        <StatCard label="Total Leads" value={stats.totalLeads} icon={BarChart3} tone="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200" />
        <StatCard label="Platform Revenue" value={formatCurrency(stats.totalRevenue)} icon={ArrowDownToLine} tone="bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-200" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Plan Breakdown</CardTitle>
            <Badge variant="secondary">{planTotal} companies</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {PLANS.map((plan) => {
              const value = stats.planBreakdown?.[plan] ?? 0;
              const percent = planTotal > 0 ? Math.round((value / planTotal) * 100) : 0;
              return (
                <div key={plan}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{plan}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.recentLeads?.length ? (
              <EmptyState title="No recent leads yet." />
            ) : (
              <div className="divide-y">
                {stats.recentLeads.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.phone}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{lead.status}</Badge>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(lead.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
