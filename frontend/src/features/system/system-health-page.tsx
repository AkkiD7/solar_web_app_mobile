import { Activity, Database, HeartPulse, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { useApiQuery } from '@/features/shared/hooks/use-api-query';
import { EmptyState } from '@/features/shared/components/empty-state';
import { LoadingState } from '@/features/shared/components/loading-state';
import { PageHeader } from '@/features/shared/components/page-header';
import { StatCard } from '@/features/shared/components/stat-card';
import { fetchHealth } from './api';

export function SystemHealthPage() {
  const { token } = useSuperAdminAuth();

  const { data: health, loading, reload } = useApiQuery(
    () => fetchHealth(token!),
    [token],
    'Failed to load system health'
  );

  if (loading && !health) return <LoadingState rows={6} />;
  if (!health) return <EmptyState title="System health unavailable." icon={HeartPulse} />;

  const memoryPercent = health.server.memoryUsage.heapTotal
    ? Math.min(100, Math.round((health.server.memoryUsage.heapUsed / health.server.memoryUsage.heapTotal) * 100))
    : 0;

  return (
    <>
      <PageHeader
        title="System Health"
        description="Database connectivity, server uptime, memory usage, and collection counts."
        actions={<Button variant="outline" onClick={reload}><RefreshCw className="size-4" /> Refresh</Button>}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard label="System Status" value={health.status} icon={HeartPulse} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200" />
        <StatCard label="Database" value={health.database.status} icon={Database} />
        <StatCard label="Uptime" value={`${Math.floor(health.server.uptime / 60)} min`} icon={Activity} tone="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200" />
      </div>
      <Card className="mt-4">
        <CardHeader><CardTitle>Memory Usage</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>{health.server.memoryUsage.heapUsed} / {health.server.memoryUsage.heapTotal} MB heap</span>
            <span className="text-muted-foreground">{memoryPercent}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted">
            <div className="h-3 rounded-full bg-primary" style={{ width: `${memoryPercent}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-muted-foreground md:grid-cols-4">
            <span>RSS: {health.server.memoryUsage.rss} MB</span>
            <span>Node: {health.server.nodeVersion}</span>
            <span>CPUs: {health.server.cpuCount}</span>
            <span>Platform: {health.server.platform}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader><CardTitle>Collections</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(health.database.collections).map(([name, count]) => (
            <div key={name} className="rounded-md border p-3">
              <div className="truncate text-sm font-medium">{name}</div>
              <div className="text-2xl font-bold text-primary">{count}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
