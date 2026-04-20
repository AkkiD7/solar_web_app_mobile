import { Badge } from '../../../shared/ui/badge';
import { LeadStatus, LEAD_STATUS_CONFIG } from '../../../shared/constants/leadStatus';

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

export default function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = LEAD_STATUS_CONFIG[status] ?? { label: status, variant: 'secondary' as const };
  return (
    <Badge variant={config.variant as any}>
      {config.label}
    </Badge>
  );
}
