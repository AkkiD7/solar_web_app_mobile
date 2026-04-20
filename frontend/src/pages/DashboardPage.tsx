import { Users, Trophy, IndianRupee, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../features/dashboard/components/StatCard';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import LeadStatusBadge from '../features/leads/components/LeadStatusBadge';
import { formatCurrency, formatDate } from '../shared/utils/format';
import type { Lead } from '../features/leads/types';

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your solar business</p>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
          ⚠️ Failed to load dashboard data. Make sure the backend is running.
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Leads"
          value={data?.totalLeads ?? 0}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Won Deals"
          value={data?.wonDeals ?? 0}
          icon={Trophy}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Revenue"
          value={data ? formatCurrency(data.totalRevenue) : '₹0'}
          icon={IndianRupee}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
          isLoading={isLoading}
        />
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Recent Leads</h2>
          <button
            onClick={() => navigate('/leads')}
            className="text-sm text-orange-500 hover:underline font-medium"
          >
            View all →
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : !data?.recentLeads?.length ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="text-4xl mb-3">☀️</div>
            <p className="text-slate-600 font-medium">No leads yet</p>
            <p className="text-slate-400 text-sm mt-1">
              <a href="/leads" className="text-orange-500 hover:underline">Add your first lead</a> to get started
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentLeads.map((lead: Lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/leads/${lead._id}`)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{lead.location || '—'}</td>
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3">
                      {lead.followUpDate ? (
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <CalendarDays className="w-3 h-3 text-orange-400" />
                          {formatDate(lead.followUpDate)}
                        </div>
                      ) : <span className="text-slate-300 text-sm">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
