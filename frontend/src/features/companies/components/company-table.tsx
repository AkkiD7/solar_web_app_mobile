import { ArrowUpDown, Edit3, Eye, LogIn, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/features/shared/utils';
import type { Company, CompanyQuery, CompanyStatus, Plan } from '../types';
import { PLANS } from '../types';

export function CompanyTable({
  rows,
  query,
  selectedIds,
  onToggleSort,
  onToggleOne,
  onToggleAll,
  onUpdatePlan,
  onUpdateStatus,
  onEdit,
  onDelete,
  onImpersonate,
}: {
  rows: Company[];
  query: CompanyQuery;
  selectedIds: Set<string>;
  onToggleSort: (sortBy: CompanyQuery['sortBy']) => void;
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
  onUpdatePlan: (company: Company, plan: Plan) => void;
  onUpdateStatus: (company: Company, status: CompanyStatus) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  onImpersonate: (company: Company) => void;
}) {
  const allVisibleSelected = rows.length > 0 && rows.every((c) => selectedIds.has(c._id));

  return (
    <table className="w-full text-left zebra-table border-collapse">
      <thead>
        <tr className="bg-surface-container-low/50 border-b border-outline-variant/60">
          <th className="p-4 w-12">
            <Checkbox checked={allVisibleSelected} onCheckedChange={onToggleAll} className="rounded border-outline-variant bg-surface-container data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
          </th>
          <th className="p-4 font-label-caps text-label-caps text-on-surface-variant/70">
            <button type="button" onClick={() => onToggleSort('name')} className="inline-flex items-center gap-1 uppercase tracking-wider">
              Company <ArrowUpDown className="size-3" />
            </button>
          </th>
          <th className="p-4 font-label-caps text-label-caps text-on-surface-variant/70 uppercase tracking-wider">Plan</th>
          <th className="p-4 font-label-caps text-label-caps text-on-surface-variant/70 uppercase tracking-wider">Status</th>
          <th className="p-4 font-label-caps text-label-caps text-on-surface-variant/70 uppercase tracking-wider">Usage</th>
          <th className="p-4 font-label-caps text-label-caps text-on-surface-variant/70 uppercase tracking-wider">Onboarding</th>
          <th className="p-4 font-label-caps text-label-caps text-on-surface-variant/70">
            <button type="button" onClick={() => onToggleSort('createdAt')} className="inline-flex items-center gap-1 uppercase tracking-wider">
              Created <ArrowUpDown className="size-3" />
            </button>
          </th>
          <th className="p-4 font-label-caps text-label-caps text-on-surface-variant/70 text-right uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {rows.map((company) => {
          // Determine badge color based on plan
          const planClass = company.plan === 'PRO' ? 'bg-primary/10 text-primary border-primary/30' :
                            company.plan === 'STARTER' ? 'bg-surface-container-highest text-on-surface-variant border-outline-variant/40' :
                            'bg-tertiary/10 text-tertiary border-tertiary/30';
          
          // Determine status color
          const isSuspended = company.status === 'SUSPENDED';
          const statusColor = isSuspended ? 'bg-rose-500' : 'bg-emerald-500';
          
          // Calculate Onboarding
          const progress = company.onboardingProgress ?? 0;
          const progressPct = (progress / 5) * 100;
          const progressColorClass = isSuspended ? 'bg-rose-500' : (progress === 5 ? 'bg-emerald-500' : 'bg-primary');
          const progressTextColorClass = isSuspended ? 'text-rose-500' : (progress === 5 ? 'text-emerald-500' : 'text-on-surface');

          return (
            <tr key={company._id} className="hover:bg-primary/5 transition-colors border-b border-outline-variant/30 group">
              <td className="p-4">
                <Checkbox checked={selectedIds.has(company._id)} onCheckedChange={() => onToggleOne(company._id)} className="rounded border-outline-variant bg-surface-container data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/40 flex items-center justify-center overflow-hidden">
                    <span className="font-stat-hero text-xl text-primary">{company.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <Link to={`/companies/${company._id}`} className="font-bold text-on-surface hover:text-primary transition-colors">{company.name}</Link>
                    <p className="text-xs text-on-surface-variant">{company.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Select value={company.plan} onValueChange={(value) => onUpdatePlan(company, value as Plan)}>
                  <SelectTrigger className={`h-6 w-24 border px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${planClass}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>{PLANS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </td>
              <td className="p-4">
                <button onClick={() => onUpdateStatus(company, company.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')} className="flex items-center gap-2 hover:opacity-80 transition-opacity" title={company.status === 'ACTIVE' ? 'Click to suspend' : 'Click to activate'}>
                  <span className={`w-2 h-2 rounded-full ${statusColor} ${!isSuspended ? 'shadow-[0_0_8px_rgba(78,222,163,0.6)]' : ''}`}></span>
                  <span className="text-on-surface font-medium capitalize">{company.status.toLowerCase()}</span>
                </button>
              </td>
              <td className="p-4">
                <p className="text-on-surface">{company.userCount ?? 0} users</p>
                <p className="text-[10px] text-on-surface-variant">{company.leadCount ?? 0} leads, {company.quoteCount ?? 0} quotes</p>
              </td>
              <td className="p-4">
                <div className="w-32">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-on-surface-variant">{progress}/5 steps</span>
                    <span className={progressTextColorClass}>{progressPct}%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full ${progressColorClass}`} style={{ width: `${progressPct}%` }}></div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-on-surface-variant">{formatDate(company.createdAt)}</td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <Link to={`/companies/${company._id}`} className="p-1.5 hover:bg-surface-container-highest rounded-md text-on-surface-variant hover:text-primary transition-colors" title="View details">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </Link>
                  <button onClick={() => onImpersonate(company)} disabled={company.status === 'SUSPENDED'} className="p-1.5 hover:bg-surface-container-highest rounded-md text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-on-surface-variant" title="Impersonate">
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                  </button>
                  <button onClick={() => onEdit(company)} className="p-1.5 hover:bg-surface-container-highest rounded-md text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button onClick={() => onDelete(company)} className="p-1.5 hover:bg-surface-container-highest rounded-md text-on-surface-variant hover:text-error transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
