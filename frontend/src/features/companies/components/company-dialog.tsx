import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getErrorMessage } from '@/features/shared/api/client';
import { TextField, SimpleSelect, SubmitButton } from '@/features/shared/components/form-fields';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { companiesApi } from '../api';
import type { Company, CompanyForm } from '../types';
import { PLANS } from '../types';

const emptyCompany: CompanyForm = { name: '', email: '', phone: '', address: '', gstNumber: '', website: '', plan: 'FREE' };

export function CompanyDialog({
  open, mode, company, onOpenChange, onSaved,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  company?: Company;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void>;
}) {
  const { token } = useSuperAdminAuth();
  const [form, setForm] = useState<CompanyForm>(emptyCompany);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(company ? {
      name: company.name, email: company.email, phone: company.phone,
      address: company.address ?? '', gstNumber: company.gstNumber ?? '',
      website: company.website ?? '', plan: company.plan,
    } : emptyCompany);
  }, [company, open]);

  const setField = (key: keyof CompanyForm, value: string) => setForm((c) => ({ ...c, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      if (mode === 'create') {
        await companiesApi.create(token, form);
        toast.success('Company created');
      } else if (company) {
        await companiesApi.update(token, company._id, form);
        toast.success('Company updated');
      }
      await onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, mode === 'create' ? 'Failed to create company' : 'Failed to update company'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Company' : 'Edit Company'}</DialogTitle>
          <DialogDescription>Manage contractor company profile and plan details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <TextField id="company-name" label="Company Name" value={form.name} onChange={(v) => setField('name', v)} required />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField id="company-email" label="Email" type="email" value={form.email} onChange={(v) => setField('email', v)} required />
            <TextField id="company-phone" label="Phone" value={form.phone} onChange={(v) => setField('phone', v)} required />
          </div>
          <TextField id="company-address" label="Address" value={form.address} onChange={(v) => setField('address', v)} required />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField id="company-gst" label="GST Number" value={form.gstNumber} onChange={(v) => setField('gstNumber', v)} />
            <TextField id="company-website" label="Website" value={form.website} onChange={(v) => setField('website', v)} />
          </div>
          <SimpleSelect label="Plan" value={form.plan} onChange={(plan) => setForm((c) => ({ ...c, plan }))} options={PLANS.map((p) => ({ value: p, label: p }))} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <SubmitButton loading={loading}>{mode === 'create' ? 'Create Company' : 'Save Changes'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
