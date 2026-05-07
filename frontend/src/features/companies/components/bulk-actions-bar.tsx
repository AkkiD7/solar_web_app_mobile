import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CompanyStatus, Plan } from '../types';
import { PLANS } from '../types';

export function BulkActionsBar({
  count,
  onBulkStatus,
  onBulkPlan,
  onBulkDelete,
  onClear,
}: {
  count: number;
  onBulkStatus: (status: CompanyStatus) => void;
  onBulkPlan: (plan: Plan) => void;
  onBulkDelete: () => void;
  onClear: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between bg-primary/10 border border-primary/40 p-3 rounded-xl animate-fade-in shadow-[0_0_20px_rgba(99,102,241,0.15)]">
      <div className="flex items-center gap-4">
        <div className="bg-primary text-primary-foreground w-6 h-6 rounded flex items-center justify-center font-bold text-[12px]">{count}</div>
        <span className="text-[13px] font-bold text-primary tracking-wide">Companies Selected</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={() => onBulkStatus('SUSPENDED')}
          className="bg-surface-container-highest/50 border border-outline-variant/60 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg hover:bg-primary/20 hover:border-primary/40 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">block</span>
          Suspend
        </button>
        <button 
          onClick={() => onBulkStatus('ACTIVE')}
          className="bg-surface-container-highest/50 border border-outline-variant/60 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg hover:bg-primary/20 hover:border-primary/40 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          Activate
        </button>
        
        <Select onValueChange={(value) => onBulkPlan(value as Plan)}>
          <SelectTrigger className="h-[32px] w-36 bg-surface-container-highest/50 border-outline-variant/60 text-white text-[12px] hover:bg-primary/20 hover:border-primary/40 transition-colors">
            <SelectValue placeholder="Change plan" />
          </SelectTrigger>
          <SelectContent>
            {PLANS.map((plan) => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="w-px h-5 bg-primary/30 mx-1 hidden sm:block"></div>
        
        <button 
          onClick={onBulkDelete}
          className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[12px] font-medium px-3 py-1.5 rounded-lg hover:bg-rose-500/20 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
          Delete
        </button>
        <button 
          onClick={onClear}
          className="text-primary hover:text-primary-fixed-dim text-[12px] font-medium ml-2 underline underline-offset-2"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
