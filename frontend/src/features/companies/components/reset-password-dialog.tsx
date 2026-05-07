import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getErrorMessage } from '@/features/shared/api/client';
import { TextField, SubmitButton } from '@/features/shared/components/form-fields';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { companiesApi } from '../api';
import type { CompanyUser } from '../types';
import { userId } from '../types';

/** B4 fix: password state resets when user prop changes via useEffect */
export function ResetPasswordDialog({
  companyId, user, onOpenChange, onSaved,
}: {
  companyId: string;
  user: CompanyUser | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void>;
}) {
  const { token } = useSuperAdminAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // B4 fix: reset password field when dialog opens/user changes
  useEffect(() => {
    setPassword('');
  }, [user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !user) return;
    setLoading(true);
    try {
      await companiesApi.resetUserPassword(token, companyId, userId(user), password);
      toast.success('Password reset');
      setPassword('');
      await onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to reset password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>{user ? `Set a new password for ${user.name}.` : null}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <TextField id="reset-password" label="New Password" type="password" value={password} onChange={setPassword} required minLength={6} helperText="Minimum 6 characters" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <SubmitButton loading={loading}>Reset Password</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
