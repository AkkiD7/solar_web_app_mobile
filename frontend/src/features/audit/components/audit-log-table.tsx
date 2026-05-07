import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, metadataText, shortId } from '@/features/shared/utils';
import type { AuditLog } from '../types';

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
