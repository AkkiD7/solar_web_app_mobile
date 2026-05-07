import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecentLead } from '../types';

/**
 * F5 — Revenue trend area chart.
 * Groups recent leads by day to show activity trend (since we don't have monthly revenue
 * from the stats endpoint, we visualize lead activity as a proxy).
 */
export function RevenueTrendChart({ recentLeads }: { recentLeads: RecentLead[] }) {
  // Group leads by date
  const dateMap = new Map<string, number>();
  recentLeads.forEach((lead) => {
    const date = new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    dateMap.set(date, (dateMap.get(date) ?? 0) + 1);
  });

  const data = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, leads: count }))
    .reverse();

  return (
    <div className="bg-surface border border-outline-variant/60 p-card-padding rounded-xl h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-section-header text-section-header text-white">Lead Activity Trend</h3>
        <div className="flex gap-2">
          <span className="text-[11px] text-on-surface-variant font-medium">Last 14 Days</span>
        </div>
      </div>
      
      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No recent data</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.4} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)', fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)', fontWeight: 600 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-container-high)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--color-on-surface)'
              }}
            />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#leadGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
