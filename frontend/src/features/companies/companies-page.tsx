import { Download, Plus, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/features/shared/api/client';
import { downloadCsv } from '@/features/shared/api/download';
import { useApiQuery } from '@/features/shared/hooks/use-api-query';
import { ConfirmDialog } from '@/features/shared/components/confirm-dialog';
import { LoadingState } from '@/features/shared/components/loading-state';
import { EmptyState } from '@/features/shared/components/empty-state';
import { PageHeader } from '@/features/shared/components/page-header';
import { Pagination } from '@/features/shared/components/pagination';
import { companiesApi } from './api';
import type { Company, CompanyQuery, CompanyStatus, ImpersonationResult, Plan } from './types';
import { CompanyFilters } from './components/company-filters';
import { CompanyTable } from './components/company-table';
import { CompanyDialog } from './components/company-dialog';
import { BulkActionsBar } from './components/bulk-actions-bar';
import { ImpersonationDialog } from './components/impersonation-dialog';

const defaultQuery: CompanyQuery = {
  search: '', status: '', plan: '', page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc',
};

export function CompaniesPage() {
  const { token } = useSuperAdminAuth();
  const [query, setQuery] = useState<CompanyQuery>(defaultQuery);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [companyDialog, setCompanyDialog] = useState<{ mode: 'create' | 'edit'; company?: Company } | null>(null);
  const [impersonation, setImpersonation] = useState<ImpersonationResult | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const { data: companies, loading, reload } = useApiQuery(
    () => companiesApi.list(token!, query),
    [token, query],
    'Failed to load companies'
  );

  const updateQuery = (updates: Partial<CompanyQuery>) => setQuery((c) => ({ ...c, ...updates }));
  const rows = companies?.data ?? [];
  const selectedList = Array.from(selectedIds);

  const toggleSort = (sortBy: CompanyQuery['sortBy']) => {
    updateQuery({ sortBy, sortOrder: query.sortBy === sortBy && query.sortOrder === 'asc' ? 'desc' : 'asc', page: 1 });
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    const next = new Set(selectedIds);
    const allSelected = rows.every((c) => selectedIds.has(c._id));
    if (allSelected) rows.forEach((c) => next.delete(c._id));
    else rows.forEach((c) => next.add(c._id));
    setSelectedIds(next);
  };

  const handleUpdateStatus = useCallback(async (company: Company, status: CompanyStatus) => {
    if (!token) return;
    try {
      await companiesApi.updateStatus(token, company._id, status);
      toast.success(`Company ${status.toLowerCase()}`);
      await reload();
    } catch (error) { toast.error(getErrorMessage(error, 'Failed to update status')); }
  }, [token, reload]);

  const handleUpdatePlan = useCallback(async (company: Company, plan: Plan) => {
    if (!token) return;
    try {
      await companiesApi.updatePlan(token, company._id, plan);
      toast.success('Plan updated');
      await reload();
    } catch (error) { toast.error(getErrorMessage(error, 'Failed to update plan')); }
  }, [token, reload]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!token || !deleteTarget) return;
    await companiesApi.delete(token, deleteTarget._id);
    toast.success('Company deleted');
    setDeleteTarget(null);
    await reload();
  }, [token, deleteTarget, reload]);

  const handleBulkStatus = useCallback(async (status: CompanyStatus) => {
    if (!token || selectedList.length === 0) return;
    try {
      await companiesApi.bulkStatus(token, selectedList, status);
      toast.success(`Updated ${selectedList.length} companies`);
      setSelectedIds(new Set());
      await reload();
    } catch (error) { toast.error(getErrorMessage(error, 'Bulk status update failed')); }
  }, [token, selectedList, reload]);

  const handleBulkPlan = useCallback(async (plan: Plan) => {
    if (!token || selectedList.length === 0) return;
    try {
      await companiesApi.bulkPlan(token, selectedList, plan);
      toast.success(`Plan changed for ${selectedList.length} companies`);
      setSelectedIds(new Set());
      await reload();
    } catch (error) { toast.error(getErrorMessage(error, 'Bulk plan update failed')); }
  }, [token, selectedList, reload]);

  const handleBulkDeleteConfirm = useCallback(async () => {
    if (!token || selectedList.length === 0) return;
    // B3 fix: sequential deletes instead of N parallel
    for (const id of selectedList) {
      await companiesApi.delete(token, id);
    }
    toast.success('Selected companies deleted');
    setSelectedIds(new Set());
    setBulkDeleteOpen(false);
    await reload();
  }, [token, selectedList, reload]);

  const handleImpersonate = useCallback(async (company: Company) => {
    if (!token) return;
    try {
      setImpersonation(await companiesApi.impersonate(token, company._id));
    } catch (error) { toast.error(getErrorMessage(error, 'Failed to generate impersonation token')); }
  }, [token]);

  const handleExport = useCallback(async () => {
    if (!token) return;
    try {
      await downloadCsv(token, '/export/companies', 'companies.csv');
      toast.success('Companies export started');
    } catch (error) { toast.error(getErrorMessage(error, 'Failed to export companies')); }
  }, [token]);

  return (
    <>
      <PageHeader
        title="Companies"
        description="Search, manage lifecycle, change plans, bulk update, export, and impersonate tenant admins."
        actions={
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="bg-surface-container-high border border-outline-variant/60 text-on-surface px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">download</span>
              Export CSV
            </button>
            <button onClick={() => setCompanyDialog({ mode: 'create' })} className="bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(128,131,255,0.3)] transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              New Company
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-4 mb-6">
        <CompanyFilters query={query} onUpdate={updateQuery} />
        <BulkActionsBar
          count={selectedList.length}
          onBulkStatus={handleBulkStatus}
          onBulkPlan={handleBulkPlan}
          onBulkDelete={() => setBulkDeleteOpen(true)}
          onClear={() => setSelectedIds(new Set())}
        />
      </div>

      <div className="bg-surface border border-outline-variant/60 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-4"><LoadingState rows={7} /></div>
        ) : rows.length === 0 ? (
          <div className="p-4"><EmptyState title="No companies match the current filters." /></div>
        ) : (
          <CompanyTable
            rows={rows} query={query} selectedIds={selectedIds}
            onToggleSort={toggleSort} onToggleOne={toggleOne} onToggleAll={toggleAll}
            onUpdatePlan={handleUpdatePlan} onUpdateStatus={handleUpdateStatus}
            onEdit={(c) => setCompanyDialog({ mode: 'edit', company: c })}
            onDelete={setDeleteTarget} onImpersonate={handleImpersonate}
          />
        )}
        <Pagination
          page={companies?.page ?? query.page}
          totalPages={companies?.totalPages ?? 1}
          total={companies?.total ?? 0}
          onPage={(page) => updateQuery({ page })}
        />
      </div>

      <CompanyDialog
        open={!!companyDialog} mode={companyDialog?.mode ?? 'create'} company={companyDialog?.company}
        onOpenChange={(open) => !open && setCompanyDialog(null)} onSaved={reload}
      />
      <ImpersonationDialog result={impersonation} onOpenChange={(open) => !open && setImpersonation(null)} />

      {/* F3: ConfirmDialog replacing window.confirm for single delete */}
      <ConfirmDialog
        open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Company" description={`Are you sure you want to soft-delete "${deleteTarget?.name}"? This action can be reversed.`}
        confirmLabel="Delete" variant="destructive" onConfirm={handleDeleteConfirm}
      />
      {/* F3: ConfirmDialog for bulk delete */}
      <ConfirmDialog
        open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}
        title="Bulk Delete Companies" description={`Soft-delete ${selectedList.length} selected companies? This action can be reversed.`}
        confirmLabel="Delete All" variant="destructive" onConfirm={handleBulkDeleteConfirm}
      />
    </>
  );
}
