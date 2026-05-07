import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getErrorMessage } from '@/features/shared/api/client';
import { TextField, SimpleSelect, SubmitButton } from '@/features/shared/components/form-fields';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { companiesApi } from '../api';
import type { CompanyUser, UserFormState } from '../types';
import { USER_ROLES, userId } from '../types';

const emptyUser: UserFormState = { name: '', email: '', password: '', role: 'ADMIN', isActive: true };

export function UserDialog({
  companyId, open, mode, user, onOpenChange, onSaved,
}: {
  companyId: string;
  open: boolean;
  mode: 'create' | 'edit';
  user?: CompanyUser;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void>;
}) {
  const { token } = useSuperAdminAuth();
  const [form, setForm] = useState<UserFormState>(emptyUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(user ? { name: user.name, email: user.email, password: '', role: user.role, isActive: user.isActive ?? true } : emptyUser);
  }, [open, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      if (mode === 'create') {
        await companiesApi.createUser(token, companyId, form);
        toast.success('User created');
      } else if (user) {
        await companiesApi.updateUser(token, companyId, userId(user), form);
        toast.success('User updated');
      }
      await onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save user'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create User' : 'Edit User'}</DialogTitle>
          <DialogDescription>Manage company user access.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <TextField id="user-name" label="Name" value={form.name} onChange={(v) => setForm((c) => ({ ...c, name: v }))} required />
          <TextField id="user-email" label="Email" type="email" value={form.email} onChange={(v) => setForm((c) => ({ ...c, email: v }))} required />
          {mode === 'create' ? (
            <TextField
              id="user-password" label="Password" type="password"
              value={form.password} onChange={(v) => setForm((c) => ({ ...c, password: v }))}
              required minLength={6} helperText="Minimum 6 characters"
            />
          ) : null}
          <SimpleSelect label="Role" value={form.role} onChange={(role) => setForm((c) => ({ ...c, role }))} options={USER_ROLES.map((r) => ({ value: r, label: r }))} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <SubmitButton loading={loading}>Save User</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
