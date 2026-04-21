import { Users, Trophy, IndianRupee, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../shared/ui/StatCard';
import { Card } from '../shared/ui/card';
import { StatusPill, type StatusTone } from '../shared/ui/StatusPill';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { formatCurrency, formatDate } from '../shared/utils/format';
import type { Lead } from '../features/leads/types';

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();
  const navigate = useNavigate();

  const getStatusTone = (status: string): StatusTone => {
    switch (status) {
      case 'NEW': return 'info';
      case 'CONTACTED': return 'warning';
      case 'QUOTED': return 'primary' as StatusTone;
      case 'WON': return 'success';
      case 'LOST': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-text tracking-tight">Dashboard</h1>
        <p className="text-textSoft font-medium mt-1">Overview of your solar business</p>
      </div>

      {isError && (
        <div className="bg-danger-soft border border-danger/20 rounded-xl p-4 text-sm font-semibold text-danger">
          ⚠️ Failed to load dashboard data. Make sure the backend is running.
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          label="Total Leads"
          value={isLoading ? '-' : (data?.totalLeads ?? 0)}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="Won Deals"
          value={isLoading ? '-' : (data?.wonDeals ?? 0)}
          icon={<Trophy className="w-5 h-5" />}
        />
        <StatCard
          label="Total Revenue"
          value={isLoading ? '-' : (data ? formatCurrency(data.totalRevenue) : '₹0')}
          icon={<IndianRupee className="w-5 h-5" />}
        />
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-text">Recent Leads</h2>
          <button
            onClick={() => navigate('/leads')}
            className="text-[13px] text-primary hover:text-primary-strong font-bold uppercase tracking-wide"
          >
            View all →
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[72px] bg-surfaceMuted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !data?.recentLeads?.length ? (
          <Card className="text-center py-12 border-dashed">
            <div className="text-4xl mb-3">☀️</div>
            <p className="text-text font-bold">No leads yet</p>
            <p className="text-textMuted text-sm mt-1">
              <a href="/leads" className="text-primary hover:underline font-semibold">Add your first lead</a> to get started
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden p-0 border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surfaceMuted/50 border-b border-border">
                    <th className="px-5 py-4 text-[11px] font-bold text-textSoft uppercase tracking-widest">Customer</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-textSoft uppercase tracking-widest hidden sm:table-cell">Location</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-textSoft uppercase tracking-widest">Status</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-textSoft uppercase tracking-widest hidden md:table-cell">Follow-up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.recentLeads.map((lead: Lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-surfaceMuted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/leads/${lead._id}`)}
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-text text-sm">{lead.name}</p>
                        <p className="text-xs text-textMuted font-medium">{lead.phone}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-textMuted font-medium hidden sm:table-cell">{lead.location || '—'}</td>
                      <td className="px-5 py-4">
                        <StatusPill label={lead.status} tone={getStatusTone(lead.status)} compact />
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        {lead.followUpDate ? (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-textMuted">
                            <CalendarDays className="w-3.5 h-3.5 text-primary" />
                            {formatDate(lead.followUpDate)}
                          </div>
                        ) : <span className="text-textSoft text-sm font-medium">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
