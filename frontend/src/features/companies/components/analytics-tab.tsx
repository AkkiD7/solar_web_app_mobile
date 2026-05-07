import { ArrowDownToLine, BarChart3, Clipboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/features/shared/components/stat-card';
import { LoadingState } from '@/features/shared/components/loading-state';
import { formatCurrency } from '@/features/shared/utils';
import type { CompanyAnalytics } from '../types';

export function AnalyticsTab({ analytics }: { analytics: CompanyAnalytics | null }) {
  if (!analytics) return <LoadingState rows={4} />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Conversion" value={`${analytics.conversionRate}%`} icon={BarChart3} />
        <StatCard label="Quotes" value={analytics.totalQuotes} icon={Clipboard} />
        <StatCard label="Revenue" value={formatCurrency(analytics.totalRevenue)} icon={ArrowDownToLine} />
        <StatCard label="Avg Deal" value={formatCurrency(analytics.avgDealSize)} icon={BarChart3} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <BarRecord title="Leads by Status" values={analytics.leadsByStatus} />
        <TimeBars title="Leads by Month" values={analytics.leadsByMonth.map((i) => ({ label: i.month, value: i.count }))} />
        <TimeBars title="Revenue by Month" values={analytics.quotesByMonth.map((i) => ({ label: i.month, value: i.revenue }))} currency />
      </div>
    </div>
  );
}

function BarRecord({ title, values }: { title: string; values: Record<string, number> }) {
  const entries = Object.entries(values);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {entries.length ? entries.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span>{value}</span></div>
            <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(value / max) * 100}%` }} /></div>
          </div>
        )) : <p className="text-sm text-muted-foreground">No data.</p>}
      </CardContent>
    </Card>
  );
}

function TimeBars({ title, values, currency }: { title: string; values: Array<{ label: string; value: number }>; currency?: boolean }) {
  const max = Math.max(1, ...values.map((i) => i.value));
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {!values.length ? <p className="text-sm text-muted-foreground">No data.</p> : (
          <div className="flex h-48 items-end gap-2">
            {values.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end">
                  <div className="w-full rounded-t-md bg-primary" style={{ height: `${Math.max(8, (item.value / max) * 144)}px` }} title={currency ? formatCurrency(item.value) : String(item.value)} />
                </div>
                <span className="max-w-16 truncate text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
