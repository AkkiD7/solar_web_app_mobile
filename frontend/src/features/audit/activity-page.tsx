import { Activity, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/features/shared/api/client';
import { EmptyState } from '@/features/shared/components/empty-state';
import { LoadingState } from '@/features/shared/components/loading-state';
import { PageHeader } from '@/features/shared/components/page-header';
import { formatDate, metadataText, shortId } from '@/features/shared/utils';
import { fetchActivityLogs } from './api';
import type { AuditLog } from './types';

/**
 * A2 fix: ActivityPage is now its own file (was exported alongside AuditLogsPage).
 * B9 fix: Stabilized interval via ref to prevent stacking.
 */
export function ActivityPage() {
  const { token } = useSuperAdminAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await fetchActivityLogs(token);
      setLogs(result.data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load activity'));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
    // B9 fix: clear any existing interval before creating a new one
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => void load(), 30000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [load]);

  return (
    <>
      <PageHeader
        title="Activity"
        description="Auto-refreshing timeline of recent platform events."
        actions={<Button variant="outline" onClick={load}><RefreshCw className="size-4" /> Refresh</Button>}
      />
      {loading && !logs.length ? (
        <LoadingState rows={8} />
      ) : logs.length === 0 ? (
        <EmptyState title="No activity yet." icon={Activity} />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log._id} className="p-4">
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Activity className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Badge>{log.action}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Company {shortId(String(log.companyId ?? ''))} - {metadataText(log.metadata)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
