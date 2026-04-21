import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Eye, CalendarDays } from 'lucide-react';
import { Button } from '../../../shared/ui/button';
import { Skeleton } from '../../../shared/ui/skeleton';
import { StatusPill, type StatusTone } from '../../../shared/ui/StatusPill';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/ui/dialog';
import LeadForm from './LeadForm';
import { useUpdateLead } from '../hooks/useUpdateLead';
import { useDeleteLead } from '../hooks/useDeleteLead';
import { formatDate } from '../../../shared/utils/format';
import type { Lead, UpdateLeadRequest } from '../types';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  isError: boolean;
}

export default function LeadTable({ leads, isLoading, isError }: LeadTableProps) {
  const navigate = useNavigate();
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead(editingLead?._id || '');

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

  const handleDelete = (lead: Lead) => {
    if (window.confirm(`Delete lead "${lead.name}"? This cannot be undone.`)) {
      deleteLead(lead._id);
    }
  };

  const handleUpdate = (data: UpdateLeadRequest) => {
    if (!editingLead) return;
    updateLead(data, { onSuccess: () => setEditingLead(null) });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-slate-600 font-medium">Failed to load leads</p>
        <p className="text-slate-400 text-sm">Check your connection and try again</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">☀️</div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">No leads yet</h3>
        <p className="text-slate-400 text-sm">Add your first lead to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-[24px] border border-border bg-surface shadow-floating">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceMuted/50 border-b border-border">
              <th className="px-5 py-4 text-[11px] font-bold text-textSoft uppercase tracking-widest">Customer</th>
              <th className="px-5 py-4 text-[11px] font-bold text-textSoft uppercase tracking-widest hidden sm:table-cell">Phone</th>
              <th className="px-5 py-4 text-[11px] font-bold text-textSoft uppercase tracking-widest hidden md:table-cell">Location</th>
              <th className="px-5 py-4 text-[11px] font-bold text-textSoft uppercase tracking-widest">Status</th>
              <th className="px-5 py-4 text-[11px] font-bold text-textSoft uppercase tracking-widest hidden lg:table-cell">Follow-up</th>
              <th className="px-5 py-4 text-right text-[11px] font-bold text-textSoft uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-surfaceMuted/50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-bold text-text text-sm">{lead.name}</p>
                  <p className="text-xs text-textMuted font-medium">{formatDate(lead.createdAt)}</p>
                </td>
                <td className="px-5 py-4 text-sm text-textMuted font-medium hidden sm:table-cell">{lead.phone}</td>
                <td className="px-5 py-4 text-sm text-textMuted font-medium hidden md:table-cell">{lead.location || '—'}</td>
                <td className="px-5 py-4">
                  <StatusPill label={lead.status} tone={getStatusTone(lead.status)} compact />
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  {lead.followUpDate ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-textMuted">
                      <CalendarDays className="w-3.5 h-3.5 text-primary" />
                      {formatDate(lead.followUpDate)}
                    </div>
                  ) : (
                    <span className="text-textSoft text-sm font-medium">—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 hover:bg-primary-soft hover:text-primary-strong"
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      title="View detail"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 hover:bg-primary-soft hover:text-primary-strong"
                      onClick={() => setEditingLead(lead)}
                      title="Edit lead"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(lead)}
                      disabled={isDeleting}
                      className="w-10 h-10 text-danger hover:text-white hover:bg-danger"
                      title="Delete lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          {editingLead && (
            <LeadForm
              defaultValues={editingLead}
              onSubmit={handleUpdate}
              isLoading={isUpdating}
              submitLabel="Update Lead"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
