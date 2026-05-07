import { Download, FileClock, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/features/shared/api/client';
import { downloadCsv } from '@/features/shared/api/download';
import { useApiQuery } from '@/features/shared/hooks/use-api-query';
import { SimpleSelect } from '@/features/shared/components/form-fields';
import { EmptyState } from '@/features/shared/components/empty-state';
import { LoadingState } from '@/features/shared/components/loading-state';
import { PageHeader } from '@/features/shared/components/page-header';
import { Pagination } from '@/features/shared/components/pagination';
import { fetchAuditLogs } from './api';
import { AuditLogTable } from './components/audit-log-table';
import type { AuditQuery } from './types';
import { auditActions } from './types';

const defaultQuery: AuditQuery = { action: '', page: 1, limit: 12 };

export function AuditLogsPage() {
  const { token } = useSuperAdminAuth();
  const [query, setQuery] = useState<AuditQuery>(defaultQuery);

  const { data: logs, loading, reload } = useApiQuery(
    () => fetchAuditLogs(token!, query),
    [token, query],
    'Failed to load audit logs'
  );

  const exportLogs = async () => {
    if (!token) return;
    try {
      await downloadCsv(token, '/export/audit-logs', 'audit-logs.csv', { limit: 1000, action: query.action || undefined });
      toast.success('Audit export started');
    } catch (error) { toast.error(getErrorMessage(error, 'Failed to export audit logs')); }
  };

  const rows = logs?.data ?? [];

  return (
    <>
      <PageHeader
        title="Audit Logs"
        description="Review platform and company actions with action filters and CSV export."
        actions={
          <>
            <Button variant="outline" onClick={exportLogs}><Download className="size-4" /> Export CSV</Button>
            <Button variant="outline" onClick={reload}><RefreshCw className="size-4" /> Refresh</Button>
          </>
        }
      />
      <Card>
        <div className="border-b p-4 md:max-w-xs">
          <SimpleSelect
            label="Action" value={query.action}
            onChange={(action) => setQuery((c) => ({ ...c, action, page: 1 }))}
            options={[{ value: '', label: 'All actions' }, ...auditActions.map((a) => ({ value: a, label: a }))]}
          />
        </div>
        {loading ? (
          <div className="p-4"><LoadingState rows={8} /></div>
        ) : rows.length === 0 ? (
          <div className="p-4"><EmptyState title="No audit logs found." icon={FileClock} /></div>
        ) : (
          <AuditLogTable logs={rows} />
        )}
        <Pagination
          page={logs?.page ?? query.page} totalPages={logs?.totalPages ?? 1} total={logs?.total ?? 0}
          onPage={(page) => setQuery((c) => ({ ...c, page }))}
        />
      </Card>
    </>
  );
}
