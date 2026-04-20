import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Eye, CalendarDays } from 'lucide-react';
import { Button } from '../../../shared/ui/button';
import { Skeleton } from '../../../shared/ui/skeleton';
import LeadStatusBadge from './LeadStatusBadge';
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
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-up</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                  <p className="text-xs text-slate-400">{formatDate(lead.createdAt)}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{lead.phone}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{lead.location || '—'}</td>
                <td className="px-4 py-4">
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-4">
                  {lead.followUpDate ? (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <CalendarDays className="w-3.5 h-3.5 text-orange-400" />
                      {formatDate(lead.followUpDate)}
                    </div>
                  ) : (
                    <span className="text-slate-300 text-sm">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      title="View detail"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
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
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
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
