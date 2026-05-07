import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/features/shared/components/empty-state';
import { formatDate, metadataText } from '@/features/shared/utils';
import type { AuditLogEntry } from '../types';

export function ActivityTab({ logs }: { logs: AuditLogEntry[] }) {
  if (!logs.length) return <EmptyState title="No recent activity found." icon={Activity} />;
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log._id}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div>
              <Badge>{log.action}</Badge>
              <p className="mt-2 text-sm text-muted-foreground">{metadataText(log.metadata)}</p>
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
