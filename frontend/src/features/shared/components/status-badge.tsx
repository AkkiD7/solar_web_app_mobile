import { Badge } from '@/components/ui/badge';

export function StatusBadge({ status }: { status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' }) {
  return (
    <Badge variant={status === 'ACTIVE' ? 'success' : 'destructive'}>
      {status}
    </Badge>
  );
}
