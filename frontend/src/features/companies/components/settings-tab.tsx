import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CompanyDetail } from '../types';

function KeyValue({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1">{value || '-'}</div>
    </div>
  );
}

function SettingsBlock({ title, data }: { title: string; data?: Record<string, unknown> }) {
  const entries = Object.entries(data ?? {}).filter(([key]) => !key.startsWith('_') && key !== '__v' && key !== 'companyId');
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {entries.length ? entries.map(([key, value]) => (
          <KeyValue key={key} label={key} value={typeof value === 'object' ? JSON.stringify(value) : String(value)} />
        )) : <p className="text-sm text-muted-foreground">No values configured.</p>}
      </CardContent>
    </Card>
  );
}

export function SettingsTab({ detail }: { detail: CompanyDetail }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <SettingsBlock title="Locale Settings" data={detail.settings} />
      <SettingsBlock title="Pricing Config" data={detail.pricingConfig} />
      <SettingsBlock title="Quote Settings" data={detail.quoteSettings} />
    </div>
  );
}
