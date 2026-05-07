import { Search } from 'lucide-react';
import { PLANS, STATUSES, type CompanyQuery, type CompanyStatus, type Plan } from '../types';

export function CompanyFilters({
  query,
  onUpdate,
}: {
  query: CompanyQuery;
  onUpdate: (updates: Partial<CompanyQuery>) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-surface/50 border border-outline-variant/30 p-2 rounded-xl gap-2">
      <div className="flex flex-col md:flex-row md:items-center gap-4 px-2 flex-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant/60 hidden md:block">FILTERS</span>
        
        <div className="hidden md:block w-px h-6 bg-outline-variant/60"></div>
        
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            className="w-full bg-surface-container-high border-none rounded-lg pl-10 pr-4 py-1.5 text-[13px] text-white placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
            placeholder="Search company, email, or phone"
            value={query.search}
            onChange={(e) => onUpdate({ search: e.target.value, page: 1 })}
          />
        </div>

        <div className="hidden md:block w-px h-6 bg-outline-variant/60"></div>

        <div className="flex gap-2">
          <select 
            className="bg-surface-container-high border-none rounded-lg px-3 py-1.5 text-[13px] text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none cursor-pointer pr-8 bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%23c7c4d7%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.5rem_center]"
            value={query.status}
            onChange={(e) => onUpdate({ status: e.target.value as CompanyStatus | '', page: 1 })}
          >
            <option value="">Status: All</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            className="bg-surface-container-high border-none rounded-lg px-3 py-1.5 text-[13px] text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none cursor-pointer pr-8 bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%23c7c4d7%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.5rem_center]"
            value={query.plan}
            onChange={(e) => onUpdate({ plan: e.target.value as Plan | '', page: 1 })}
          >
            <option value="">Plan: All</option>
            {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {(query.search || query.status || query.plan) && (
          <button 
            onClick={() => onUpdate({ search: '', status: '', plan: '', page: 1 })}
            className="text-xs text-primary hover:underline px-2"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
