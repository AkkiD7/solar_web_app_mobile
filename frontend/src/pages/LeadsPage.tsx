import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../shared/ui/dialog';
import LeadTable from '../features/leads/components/LeadTable';
import LeadForm from '../features/leads/components/LeadForm';
import { useLeads } from '../features/leads/hooks/useLeads';
import { useCreateLead } from '../features/leads/hooks/useCreateLead';
import type { CreateLeadRequest } from '../features/leads/types';

export default function LeadsPage() {
  const [open, setOpen] = useState(false);
  const { data: leads = [], isLoading, isError } = useLeads();
  const { mutate: createLead, isPending } = useCreateLead();

  const handleCreate = (data: CreateLeadRequest) => {
    createLead(data, { onSuccess: () => setOpen(false) });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text tracking-tight">Leads</h1>
          <p className="text-textSoft font-medium mt-1">
            {leads.length} {leads.length === 1 ? 'lead' : 'leads'} total
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button id="add-lead-btn">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <LeadForm onSubmit={handleCreate} isLoading={isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <LeadTable leads={leads} isLoading={isLoading} isError={isError} />
    </div>
  );
}
