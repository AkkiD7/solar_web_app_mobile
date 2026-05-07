import { ArrowDownToLine, BarChart3, Building2, Users } from 'lucide-react';
import { StatCard } from '@/features/shared/components/stat-card';
import { formatCurrency } from '@/features/shared/utils';
import type { GlobalStats } from '../types';

export function StatsOverview({ stats }: { stats: GlobalStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-grid-gap mb-grid-gap">
      <StatCard label="Total Companies" value={stats.totalCompanies} icon={Building2} tone="bg-sky-500/10 text-sky-500" />
      <StatCard label="Active Companies" value={stats.activeCompanies} icon={Users} tone="bg-emerald-500/10 text-emerald-500" />
      <StatCard label="Total Leads" value={stats.totalLeads} icon={BarChart3} tone="bg-amber-500/10 text-amber-500" />
      <StatCard label="Platform Revenue" value={formatCurrency(stats.totalRevenue)} icon={ArrowDownToLine} tone="bg-indigo-500/10 text-indigo-500" />
    </div>
  );
}
