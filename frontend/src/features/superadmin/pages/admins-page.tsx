import { Plus, RefreshCw, Trash2, UserCog } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getErrorMessage, superAdminApi } from '../api';
import { useSuperAdminAuth } from '../auth';
import { EmptyState, LoadingState, PageHeader, SubmitButton, TextField } from '../components/common';
import type { PlatformAdmin } from '../types';
import { formatDate } from '../utils';

export function AdminsPage() {
  const { token } = useSuperAdminAuth();
  const [admins, setAdmins] = useState<PlatformAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setAdmins(await superAdminApi.listAdmins(token));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load admins'));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await superAdminApi.createAdmin(token, email, password);
      toast.success('Admin created');
      setEmail('');
      setPassword('');
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create admin'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (admin: PlatformAdmin) => {
    if (!token || !window.confirm(`Delete ${admin.email}?`)) return;
    try {
      await superAdminApi.deleteAdmin(token, admin._id);
      toast.success('Admin deleted');
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete admin'));
    }
  };

  return (
    <>
      <PageHeader
        title="Admins"
        description="Create and remove platform-level super admins."
        actions={<Button variant="outline" onClick={load}><RefreshCw className="size-4" /> Refresh</Button>}
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
          ) : admins.length === 0 ? (
            <div className="p-4"><EmptyState title="No admins found." icon={UserCog} /></div>
          ) : (
            <div className="divide-y">
              {admins.map((admin) => (
                <div key={admin._id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <div className="font-medium">{admin.email}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(admin.createdAt)}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => void remove(admin)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
