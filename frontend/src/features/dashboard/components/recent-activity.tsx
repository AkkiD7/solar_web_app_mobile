import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/features/shared/components/empty-state';
import { formatDate } from '@/features/shared/utils';
import { cn } from '@/lib/utils';
import type { RecentLead } from '../types';

export function RecentActivity({ recentLeads }: { recentLeads: RecentLead[] }) {
  return (
    <div className="bg-surface border border-outline-variant/60 p-card-padding rounded-xl h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-section-header text-section-header text-white">Recent Activity</h3>
        <button className="text-primary text-[12px] font-bold hover:underline">View All</button>
      </div>
      
      {!recentLeads?.length ? (
        <EmptyState title="No recent leads yet." />
      ) : (
        <div className="space-y-4">
          {recentLeads.map((lead) => {
            // Determine styling based on status
            const isLost = lead.status.toLowerCase().includes('lost');
            const isNew = lead.status.toLowerCase().includes('new');
            const badgeColor = isLost ? 'bg-rose-500/10 text-rose-500' : (isNew ? 'bg-emerald-500/10 text-emerald-500' : 'bg-sky-500/10 text-sky-500');
            const iconColor = isLost ? 'text-rose-500' : (isNew ? 'text-emerald-500' : 'text-sky-500');
            const iconName = isLost ? 'person_off' : (isNew ? 'person_add' : 'history');

            return (
              <div key={lead._id} className="flex items-center justify-between group cursor-pointer border-b border-outline-variant/20 pb-4 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center', iconColor)}>
                    <span className="material-symbols-outlined text-[20px]">{iconName}</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{lead.name}</p>
                    <p className="text-[12px] text-on-surface-variant">{lead.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn('inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1', badgeColor)}>
                    {lead.status}
                  </span>
                  <p className="text-[11px] text-on-surface-variant/60">{formatDate(lead.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
