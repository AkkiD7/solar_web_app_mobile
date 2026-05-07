import { Activity, ArrowDownToLine, BarChart3, Clipboard, Download, Edit3, KeyRound, Plus, RefreshCw, Trash2, Users } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { downloadSuperAdminCsv, getErrorMessage, superAdminApi } from '../api';
import { useSuperAdminAuth } from '../auth';
import { EmptyState, LoadingState, PageHeader, SimpleSelect, StatCard, StatusBadge, SubmitButton, TextField } from '../components/common';
import type { CompanyAnalytics, CompanyDetail, CompanyUser, UserFormState } from '../types';
import { USER_ROLES } from '../types';
import { formatCurrency, formatDate, metadataText, userId } from '../utils';

const emptyUser: UserFormState = {
  name: '',
  email: '',
  password: '',
  role: 'ADMIN',
  isActive: true,
};

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useSuperAdminAuth();
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [analytics, setAnalytics] = useState<CompanyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDialog, setUserDialog] = useState<{ mode: 'create' | 'edit'; user?: CompanyUser } | null>(null);
  const [resetUser, setResetUser] = useState<CompanyUser | null>(null);

  const load = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const [nextDetail, nextUsers, nextAnalytics] = await Promise.all([
        superAdminApi.detail(token, id),
        superAdminApi.listUsers(token, id),
        superAdminApi.analytics(token, id),
      ]);
      setDetail(nextDetail);
      setUsers(nextUsers);
      setAnalytics(nextAnalytics);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load company detail'));
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const exportData = async () => {
    if (!token || !id) return;
    try {
      await downloadSuperAdminCsv(token, `/export/companies/${id}/data`, `company-${id}.csv`);
      toast.success('Company export started');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to export company data'));
    }
  };

  const deactivateUser = async (user: CompanyUser) => {
    if (!token || !id || !window.confirm(`Deactivate ${user.name}?`)) return;
    try {
      await superAdminApi.deleteUser(token, id, userId(user));
      toast.success('User deactivated');
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to deactivate user'));
    }
  };

  if (loading && !detail) {
    return <LoadingState rows={8} />;
  }

  if (!detail || !id) {
    return <EmptyState title="Company not found." />;
  }

  return (
    <>
      <PageHeader
        title={detail.name}
        description={`${detail.email} - ${detail.plan} - ${detail.status}`}
        actions={
          <>
            <Button variant="outline" asChild><Link to="/superadmin/companies">Back</Link></Button>
            <Button variant="outline" onClick={exportData}><Download className="size-4" /> Export Data</Button>
            <Button variant="outline" onClick={load}><RefreshCw className="size-4" /> Refresh</Button>
          </>
        }
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview detail={detail} />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab
            users={users}
            onCreate={() => setUserDialog({ mode: 'create' })}
            onEdit={(user) => setUserDialog({ mode: 'edit', user })}
            onReset={setResetUser}
            onDeactivate={deactivateUser}
          />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsTab analytics={analytics} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityTab logs={detail.recentLogs} />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab detail={detail} />
        </TabsContent>
      </Tabs>

      <UserDialog
        companyId={id}
        open={!!userDialog}
        mode={userDialog?.mode ?? 'create'}
        user={userDialog?.user}
        onOpenChange={(open) => !open && setUserDialog(null)}
        onSaved={load}
      />
      <ResetPasswordDialog
        companyId={id}
        user={resetUser}
        onOpenChange={(open) => !open && setResetUser(null)}
        onSaved={load}
      />
    </>
  );
}

function Overview({ detail }: { detail: CompanyDetail }) {
  const steps = detail.onboardingSteps ?? {};
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Leads" value={detail.totalLeads} icon={BarChart3} />
        <StatCard label="Quotes" value={detail.quoteStats.totalQuotes} icon={Clipboard} tone="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200" />
        <StatCard label="Revenue" value={formatCurrency(detail.quoteStats.totalRevenue)} icon={ArrowDownToLine} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200" />
        <StatCard label="Average Deal" value={formatCurrency(detail.quoteStats.avgDealSize)} icon={BarChart3} tone="bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <KeyValue label="Name" value={detail.name} />
            <KeyValue label="Email" value={detail.email} />
            <KeyValue label="Phone" value={detail.phone} />
            <KeyValue label="Address" value={detail.address} />
            <KeyValue label="GST" value={detail.gstNumber} />
            <KeyValue label="Website" value={detail.website} />
            <KeyValue label="Plan" value={<Badge>{detail.plan}</Badge>} />
            <KeyValue label="Status" value={<StatusBadge status={detail.status} />} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Onboarding</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ['Profile complete', steps.profileComplete],
              ['Logo uploaded', steps.logoUploaded],
              ['First lead created', steps.firstLeadCreated],
              ['First quote generated', steps.firstQuoteGenerated],
              ['Pricing configured', steps.pricingConfigured],
            ].map(([label, done]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm">{label}</span>
                <Badge variant={done ? 'success' : 'secondary'}>{done ? 'Done' : 'Pending'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1">{value || '-'}</div>
    </div>
  );
}

function UsersTab({
  users,
  onCreate,
  onEdit,
  onReset,
  onDeactivate,
}: {
  users: CompanyUser[];
  onCreate: () => void;
  onEdit: (user: CompanyUser) => void;
  onReset: (user: CompanyUser) => void;
  onDeactivate: (user: CompanyUser) => void;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b p-4">
        <div className="font-semibold">Company Users</div>
        <Button onClick={onCreate}><Plus className="size-4" /> Add User</Button>
      </div>
      {!users.length ? (
        <div className="p-4"><EmptyState title="No users found." icon={Users} /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={userId(user)}>
                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                <TableCell><StatusBadge status={user.isActive === false ? 'INACTIVE' : 'ACTIVE'} /></TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(user)}><Edit3 className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onReset(user)}><KeyRound className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeactivate(user)}><Trash2 className="size-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

function AnalyticsTab({ analytics }: { analytics: CompanyAnalytics | null }) {
  if (!analytics) return <LoadingState rows={4} />;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Conversion" value={`${analytics.conversionRate}%`} icon={BarChart3} />
        <StatCard label="Quotes" value={analytics.totalQuotes} icon={Clipboard} />
        <StatCard label="Revenue" value={formatCurrency(analytics.totalRevenue)} icon={ArrowDownToLine} />
        <StatCard label="Avg Deal" value={formatCurrency(analytics.avgDealSize)} icon={BarChart3} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <BarRecord title="Leads by Status" values={analytics.leadsByStatus} />
        <TimeBars title="Leads by Month" values={analytics.leadsByMonth.map((item) => ({ label: item.month, value: item.count }))} />
        <TimeBars title="Revenue by Month" values={analytics.quotesByMonth.map((item) => ({ label: item.month, value: item.revenue }))} currency />
      </div>
    </div>
  );
}

function BarRecord({ title, values }: { title: string; values: Record<string, number> }) {
  const entries = Object.entries(values);
  const max = Math.max(1, ...entries.map(([, value]) => value));
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {entries.length ? entries.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span>{value}</span></div>
            <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(value / max) * 100}%` }} /></div>
          </div>
        )) : <p className="text-sm text-muted-foreground">No data.</p>}
      </CardContent>
    </Card>
  );
}

function TimeBars({ title, values, currency }: { title: string; values: Array<{ label: string; value: number }>; currency?: boolean }) {
  const max = Math.max(1, ...values.map((item) => item.value));
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {!values.length ? <p className="text-sm text-muted-foreground">No data.</p> : (
          <div className="flex h-48 items-end gap-2">
            {values.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end">
                  <div className="w-full rounded-t-md bg-primary" style={{ height: `${Math.max(8, (item.value / max) * 144)}px` }} title={currency ? formatCurrency(item.value) : String(item.value)} />
                </div>
                <span className="max-w-16 truncate text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityTab({ logs }: { logs: CompanyDetail['recentLogs'] }) {
  if (!logs.length) return <EmptyState title="No recent activity found." icon={Activity} />;
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log._id}>
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div>
              <Badge>{log.action}</Badge>
              <p className="mt-2 text-sm text-muted-foreground">{metadataText(log.metadata)}</p>
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SettingsTab({ detail }: { detail: CompanyDetail }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <SettingsBlock title="Locale Settings" data={detail.settings} />
      <SettingsBlock title="Pricing Config" data={detail.pricingConfig} />
      <SettingsBlock title="Quote Settings" data={detail.quoteSettings} />
    </div>
  );
}

function SettingsBlock({ title, data }: { title: string; data?: Record<string, unknown> }) {
  const entries = Object.entries(data ?? {}).filter(([key]) => !key.startsWith('_') && key !== '__v' && key !== 'companyId');
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {entries.length ? entries.map(([key, value]) => (
          <KeyValue key={key} label={key} value={typeof value === 'object' ? JSON.stringify(value) : String(value)} />
        )) : <p className="text-sm text-muted-foreground">No values configured.</p>}
      </CardContent>
    </Card>
  );
}

function UserDialog({
  companyId,
  open,
  mode,
  user,
  onOpenChange,
  onSaved,
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
        await superAdminApi.createUser(token, companyId, form);
        toast.success('User created');
      } else if (user) {
        await superAdminApi.updateUser(token, companyId, userId(user), form);
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
          <TextField id="user-name" label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
          <TextField id="user-email" label="Email" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} required />
          {mode === 'create' ? <TextField id="user-password" label="Password" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} required /> : null}
          <SimpleSelect label="Role" value={form.role} onChange={(role) => setForm((current) => ({ ...current, role }))} options={USER_ROLES.map((role) => ({ value: role, label: role }))} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <SubmitButton loading={loading}>Save User</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({
  companyId,
  user,
  onOpenChange,
  onSaved,
}: {
  companyId: string;
  user: CompanyUser | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void>;
}) {
  const { token } = useSuperAdminAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !user) return;
    setLoading(true);
    try {
      await superAdminApi.resetUserPassword(token, companyId, userId(user), password);
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
          <TextField id="reset-password" label="New Password" type="password" value={password} onChange={setPassword} required />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <SubmitButton loading={loading}>Reset Password</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
