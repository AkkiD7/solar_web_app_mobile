import { Download, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/features/shared/api/client';
import { downloadCsv } from '@/features/shared/api/download';
import { useApiQuery } from '@/features/shared/hooks/use-api-query';
import { ConfirmDialog } from '@/features/shared/components/confirm-dialog';
import { LoadingState } from '@/features/shared/components/loading-state';
import { EmptyState } from '@/features/shared/components/empty-state';
import { PageHeader } from '@/features/shared/components/page-header';
import { companiesApi } from './api';
import type { CompanyUser, CompanyAnalytics, CompanyDetail as CompanyDetailType } from './types';
import { userId } from './types';
import { OverviewTab } from './components/overview-tab';
import { UsersTab } from './components/users-tab';
import { AnalyticsTab } from './components/analytics-tab';
import { ActivityTab } from './components/activity-tab';
import { SettingsTab } from './components/settings-tab';
import { UserDialog } from './components/user-dialog';
import { ResetPasswordDialog } from './components/reset-password-dialog';

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useSuperAdminAuth();
  const [userDialog, setUserDialog] = useState<{ mode: 'create' | 'edit'; user?: CompanyUser } | null>(null);
  const [resetUser, setResetUser] = useState<CompanyUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<CompanyUser | null>(null);

  const { data, loading, reload } = useApiQuery(
    async () => {
      const [detail, users, analytics] = await Promise.all([
        companiesApi.detail(token!, id!),
        companiesApi.listUsers(token!, id!),
        companiesApi.analytics(token!, id!),
      ]);
      return { detail, users, analytics };
    },
    [token, id],
    'Failed to load company detail'
  );

  const detail = data?.detail ?? null;
  const users = data?.users ?? [];
  const analytics = data?.analytics ?? null;

  const handleExport = useCallback(async () => {
    if (!token || !id) return;
    try {
      await downloadCsv(token, `/export/companies/${id}/data`, `company-${id}.csv`);
      toast.success('Company export started');
    } catch (error) { toast.error(getErrorMessage(error, 'Failed to export company data')); }
  }, [token, id]);

  const handleDeactivateConfirm = useCallback(async () => {
    if (!token || !id || !deactivateTarget) return;
    await companiesApi.deleteUser(token, id, userId(deactivateTarget));
    toast.success('User deactivated');
    setDeactivateTarget(null);
    await reload();
  }, [token, id, deactivateTarget, reload]);

  if (loading && !detail) return <LoadingState rows={8} />;
  if (!detail || !id) return <EmptyState title="Company not found." />;

  return (
    <>
      <PageHeader
        title={detail.name}
        description={`${detail.email} - ${detail.plan} - ${detail.status}`}
        actions={
          <>
            <Button variant="outline" asChild><Link to="/companies">Back</Link></Button>
            <Button variant="outline" onClick={handleExport}><Download className="size-4" /> Export Data</Button>
            <Button variant="outline" onClick={reload}><RefreshCw className="size-4" /> Refresh</Button>
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
        <TabsContent value="overview"><OverviewTab detail={detail} /></TabsContent>
        <TabsContent value="users">
          <UsersTab
            users={users}
            onCreate={() => setUserDialog({ mode: 'create' })}
            onEdit={(user) => setUserDialog({ mode: 'edit', user })}
            onReset={setResetUser}
            onDeactivate={setDeactivateTarget}
          />
        </TabsContent>
        <TabsContent value="analytics"><AnalyticsTab analytics={analytics} /></TabsContent>
        <TabsContent value="activity"><ActivityTab logs={detail.recentLogs} /></TabsContent>
        <TabsContent value="settings"><SettingsTab detail={detail} /></TabsContent>
      </Tabs>

      <UserDialog companyId={id} open={!!userDialog} mode={userDialog?.mode ?? 'create'} user={userDialog?.user} onOpenChange={(open) => !open && setUserDialog(null)} onSaved={reload} />
      <ResetPasswordDialog companyId={id} user={resetUser} onOpenChange={(open) => !open && setResetUser(null)} onSaved={reload} />

      {/* F3: ConfirmDialog replacing window.confirm for user deactivation */}
      <ConfirmDialog
        open={!!deactivateTarget} onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Deactivate User" description={`Are you sure you want to deactivate "${deactivateTarget?.name}"?`}
        confirmLabel="Deactivate" variant="destructive" onConfirm={handleDeactivateConfirm}
      />
    </>
  );
}
