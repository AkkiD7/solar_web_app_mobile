import { Plus, RefreshCw, Trash2, UserCog } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/features/shared/api/client';
import { useApiQuery } from '@/features/shared/hooks/use-api-query';
import { ConfirmDialog } from '@/features/shared/components/confirm-dialog';
import { EmptyState } from '@/features/shared/components/empty-state';
import { LoadingState } from '@/features/shared/components/loading-state';
import { PageHeader } from '@/features/shared/components/page-header';
import { TextField, SubmitButton } from '@/features/shared/components/form-fields';
import { formatDate } from '@/features/shared/utils';
import * as adminsApi from './api';
import type { PlatformAdmin } from './types';

export function AdminsPage() {
  const { token } = useSuperAdminAuth();
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PlatformAdmin | null>(null);

  const { data: admins, loading, reload } = useApiQuery(
    () => adminsApi.listAdmins(token!),
    [token],
    'Failed to load admins'
  );

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await adminsApi.createAdmin(token, email, password);
      toast.success('Admin created');
      setEmail('');
      setPassword('');
      await reload();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create admin'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    await adminsApi.deleteAdmin(token, deleteTarget._id);
    toast.success('Admin deleted');
    setDeleteTarget(null);
    await reload();
  };

  return (
    <>
      <PageHeader
        title="Admins"
        description="Create and remove platform-level super admins."
        actions={<Button variant="outline" onClick={reload}><RefreshCw className="size-4" /> Refresh</Button>}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>Invite Admin</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={create} className="space-y-4">
              <TextField id="admin-email" label="Email" type="email" value={email} onChange={setEmail} required />
              <TextField id="admin-password" label="Password" type="password" value={password} onChange={setPassword} required />
              <SubmitButton loading={saving}><Plus className="size-4" /> Create Admin</SubmitButton>
            </form>
          </CardContent>
        </Card>
        <Card>
          {loading ? (
            <div className="p-4"><LoadingState rows={5} /></div>
          ) : !admins?.length ? (
            <div className="p-4"><EmptyState title="No admins found." icon={UserCog} /></div>
          ) : (
            <div className="divide-y">
              {admins.map((admin) => (
                <div key={admin._id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <div className="font-medium">{admin.email}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(admin.createdAt)}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(admin)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Admin" description={`Are you sure you want to delete "${deleteTarget?.email}"?`}
        confirmLabel="Delete" variant="destructive" onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
