import { ArrowDownToLine, BarChart3, Clipboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/features/shared/components/stat-card';
import { StatusBadge } from '@/features/shared/components/status-badge';
import { formatCurrency } from '@/features/shared/utils';
import type { CompanyDetail } from '../types';

function KeyValue({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1">{value || '-'}</div>
    </div>
  );
}

export function OverviewTab({ detail }: { detail: CompanyDetail }) {
  const steps = detail.onboardingSteps ?? {};
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Leads" value={detail.totalLeads} icon={BarChart3} />
        <StatCard label="Quotes" value={detail.quoteStats.totalQuotes} icon={Clipboard} tone="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200" />
        <StatCard label="Revenue" value={formatCurrency(detail.quoteStats.totalRevenue)} icon={ArrowDownToLine} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200" />
        <StatCard label="Average Deal" value={formatCurrency(detail.quoteStats.avgDealSize)} icon={BarChart3} tone="bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <KeyValue label="Name" value={detail.name} />
            <KeyValue label="Email" value={detail.email} />
            <KeyValue label="Phone" value={detail.phone} />
            <KeyValue label="Address" value={detail.address} />
            <KeyValue label="GST" value={detail.gstNumber} />
            <KeyValue label="Website" value={detail.website} />
            <KeyValue label="Plan" value={<Badge>{detail.plan}</Badge>} />
            <KeyValue label="Status" value={<StatusBadge status={detail.status} />} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Onboarding</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {([
              ['Profile complete', steps.profileComplete],
              ['Logo uploaded', steps.logoUploaded],
              ['First lead created', steps.firstLeadCreated],
              ['First quote generated', steps.firstQuoteGenerated],
              ['Pricing configured', steps.pricingConfigured],
            ] as const).map(([label, done]) => (
              <div key={label} className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm">{label}</span>
                <Badge variant={done ? 'success' : 'secondary'}>{done ? 'Done' : 'Pending'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
