import { Activity, Download, FileClock, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { downloadSuperAdminCsv, getErrorMessage, superAdminApi } from '../api';
import { useSuperAdminAuth } from '../auth';
import { EmptyState, LoadingState, PageHeader, Pagination, SimpleSelect } from '../components/common';
import type { AuditLog, AuditQuery, Paginated } from '../types';
import { auditActions } from '../types';
import { formatDate, metadataText, shortId } from '../utils';

const defaultQuery: AuditQuery = {
  action: '',
  page: 1,
  limit: 12,
};

export function AuditLogsPage() {
  const { token } = useSuperAdminAuth();
  const [query, setQuery] = useState<AuditQuery>(defaultQuery);
  const [logs, setLogs] = useState<Paginated<AuditLog> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setLogs(await superAdminApi.auditLogs(token, query));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load audit logs'));
    } finally {
      setLoading(false);
    }
  }, [query, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const exportLogs = async () => {
    if (!token) return;
    try {
      await downloadSuperAdminCsv(token, '/export/audit-logs', 'audit-logs.csv', {
        limit: 1000,
        action: query.action || undefined,
      });
      toast.success('Audit export started');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to export audit logs'));
    }
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
            <Button variant="outline" onClick={load}><RefreshCw className="size-4" /> Refresh</Button>
          </>
        }
      />
      <Card>
        <div className="border-b p-4 md:max-w-xs">
          <SimpleSelect
            label="Action"
            value={query.action}
            onChange={(action) => setQuery((current) => ({ ...current, action, page: 1 }))}
            options={[{ value: '', label: 'All actions' }, ...auditActions.map((action) => ({ value: action, label: action }))]}
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
          page={logs?.page ?? query.page}
          totalPages={logs?.totalPages ?? 1}
          total={logs?.total ?? 0}
          onPage={(page) => setQuery((current) => ({ ...current, page }))}
        />
      </Card>
    </>
  );
}

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Performed By</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log._id}>
            <TableCell>{formatDate(log.createdAt)}</TableCell>
            <TableCell>{shortId(String(log.companyId ?? ''))}</TableCell>
            <TableCell><Badge>{log.action}</Badge></TableCell>
            <TableCell>{log.performedBy}</TableCell>
            <TableCell className="max-w-lg text-xs text-muted-foreground">{metadataText(log.metadata)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ActivityPage() {
  const { token } = useSuperAdminAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await superAdminApi.activityLogs(token);
      setLogs(result.data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load activity'));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(), 30000);
    return () => window.clearInterval(interval);
  }, [load]);

  return (
    <>
      <PageHeader
        title="Activity"
        description="Auto-refreshing timeline of recent platform events."
        actions={<Button variant="outline" onClick={load}><RefreshCw className="size-4" /> Refresh</Button>}
      />
      {loading ? (
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
