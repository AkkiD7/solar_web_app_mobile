import { ArrowUpDown, Copy, Download, Edit3, Eye, LogIn, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { downloadSuperAdminCsv, getErrorMessage, superAdminApi } from '../api';
import { useSuperAdminAuth } from '../auth';
import { EmptyState, LoadingState, PageHeader, Pagination, PlanBadge, SimpleSelect, StatusBadge, SubmitButton, TextField } from '../components/common';
import type { Company, CompanyForm, CompanyQuery, CompanyStatus, ImpersonationResult, Paginated, Plan } from '../types';
import { PLANS, STATUSES } from '../types';
import { formatDate } from '../utils';

const defaultQuery: CompanyQuery = {
  search: '',
  status: '',
  plan: '',
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const emptyCompany: CompanyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  gstNumber: '',
  website: '',
  plan: 'FREE',
};

export function CompaniesPage() {
  const { token } = useSuperAdminAuth();
  const [query, setQuery] = useState<CompanyQuery>(defaultQuery);
  const [companies, setCompanies] = useState<Paginated<Company> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [companyDialog, setCompanyDialog] = useState<{ mode: 'create' | 'edit'; company?: Company } | null>(null);
  const [impersonation, setImpersonation] = useState<ImpersonationResult | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setCompanies(await superAdminApi.companies(token, query));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load companies'));
    } finally {
      setLoading(false);
    }
  }, [query, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateQuery = (updates: Partial<CompanyQuery>) => setQuery((current) => ({ ...current, ...updates }));

  const rows = companies?.data ?? [];
  const selectedList = Array.from(selectedIds);
  const allVisibleSelected = rows.length > 0 && rows.every((company) => selectedIds.has(company._id));

  const toggleSort = (sortBy: CompanyQuery['sortBy']) => {
    updateQuery({
      sortBy,
      sortOrder: query.sortBy === sortBy && query.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    });
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleAllVisible = () => {
    const next = new Set(selectedIds);
    if (allVisibleSelected) rows.forEach((company) => next.delete(company._id));
    else rows.forEach((company) => next.add(company._id));
    setSelectedIds(next);
  };

  const updateStatus = async (company: Company, status: CompanyStatus) => {
    if (!token) return;
    try {
      await superAdminApi.updateStatus(token, company._id, status);
      toast.success(`Company ${status.toLowerCase()}`);
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update status'));
    }
  };

  const updatePlan = async (company: Company, plan: Plan) => {
    if (!token) return;
    try {
      await superAdminApi.updatePlan(token, company._id, plan);
      toast.success('Plan updated');
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update plan'));
    }
  };

  const deleteCompany = async (company: Company) => {
    if (!token || !window.confirm(`Soft-delete ${company.name}?`)) return;
    try {
      await superAdminApi.deleteCompany(token, company._id);
      toast.success('Company deleted');
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete company'));
    }
  };

  const bulkStatus = async (status: CompanyStatus) => {
    if (!token || selectedList.length === 0) return;
    try {
      await superAdminApi.bulkStatus(token, selectedList, status);
      toast.success(`Updated ${selectedList.length} companies`);
      setSelectedIds(new Set());
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Bulk status update failed'));
    }
  };

  const bulkPlan = async (plan: Plan) => {
    if (!token || selectedList.length === 0) return;
    try {
      await superAdminApi.bulkPlan(token, selectedList, plan);
      toast.success(`Plan changed for ${selectedList.length} companies`);
      setSelectedIds(new Set());
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Bulk plan update failed'));
    }
  };

  const bulkDelete = async () => {
    if (!token || selectedList.length === 0 || !window.confirm(`Soft-delete ${selectedList.length} companies?`)) return;
    try {
      await Promise.all(selectedList.map((id) => superAdminApi.deleteCompany(token, id)));
      toast.success('Selected companies deleted');
      setSelectedIds(new Set());
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Bulk delete failed'));
    }
  };

  const exportCompanies = async () => {
    if (!token) return;
    try {
      await downloadSuperAdminCsv(token, '/export/companies', 'companies.csv');
      toast.success('Companies export started');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to export companies'));
    }
  };

  const impersonate = async (company: Company) => {
    if (!token) return;
    try {
      setImpersonation(await superAdminApi.impersonate(token, company._id));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to generate impersonation token'));
    }
  };

  return (
    <>
      <PageHeader
        title="Companies"
        description="Search, manage lifecycle, change plans, bulk update, export, and impersonate tenant admins."
        actions={
          <>
            <Button variant="outline" onClick={exportCompanies}>
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={load}>
              <RefreshCw className="size-4" />
              Refresh
            </Button>
            <Button onClick={() => setCompanyDialog({ mode: 'create' })}>
              <Plus className="size-4" />
              New Company
            </Button>
          </>
        }
      />

      <Card>
        <div className="grid gap-3 border-b p-4 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search company, email, or phone"
              value={query.search}
              onChange={(event) => updateQuery({ search: event.target.value, page: 1 })}
            />
          </div>
          <SimpleSelect
            value={query.status}
            onChange={(status) => updateQuery({ status, page: 1 })}
            options={[{ value: '', label: 'All statuses' }, ...STATUSES.map((status) => ({ value: status, label: status }))]}
          />
          <SimpleSelect
            value={query.plan}
            onChange={(plan) => updateQuery({ plan, page: 1 })}
            options={[{ value: '', label: 'All plans' }, ...PLANS.map((plan) => ({ value: plan, label: plan }))]}
          />
        </div>

        {selectedList.length ? (
          <div className="flex flex-col gap-3 border-b bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium">{selectedList.length} selected</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => void bulkStatus('SUSPENDED')}>Suspend</Button>
              <Button variant="outline" size="sm" onClick={() => void bulkStatus('ACTIVE')}>Activate</Button>
              <Select onValueChange={(value) => void bulkPlan(value as Plan)}>
                <SelectTrigger className="h-8 w-36">
                  <SelectValue placeholder="Change plan" />
                </SelectTrigger>
                <SelectContent>
                  {PLANS.map((plan) => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="destructive" size="sm" onClick={() => void bulkDelete()}>
                <Trash2 className="size-4" />
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>Clear</Button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="p-4"><LoadingState rows={7} /></div>
        ) : rows.length === 0 ? (
          <div className="p-4"><EmptyState title="No companies match the current filters." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allVisibleSelected} onCheckedChange={toggleAllVisible} />
                </TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-1">
                    Company <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort('createdAt')} className="inline-flex items-center gap-1">
                    Created <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>
                    <Checkbox checked={selectedIds.has(company._id)} onCheckedChange={() => toggleOne(company._id)} />
                  </TableCell>
                  <TableCell>
                    <Link to={`/superadmin/companies/${company._id}`} className="font-medium hover:text-primary">{company.name}</Link>
                    <div className="text-xs text-muted-foreground">{company.email}</div>
                  </TableCell>
                  <TableCell>
                    <Select value={company.plan} onValueChange={(value) => void updatePlan(company, value as Plan)}>
                      <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>{PLANS.map((plan) => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><StatusBadge status={company.status} /></TableCell>
                  <TableCell className="text-sm">
                    <div>{company.userCount ?? 0} users</div>
                    <div className="text-xs text-muted-foreground">{company.leadCount ?? 0} leads, {company.quoteCount ?? 0} quotes</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${((company.onboardingProgress ?? 0) / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{company.onboardingProgress ?? 0}/5</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(company.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" title="View details">
                        <Link to={`/superadmin/companies/${company._id}`}><Eye className="size-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => setCompanyDialog({ mode: 'edit', company })}>
                        <Edit3 className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Impersonate" disabled={company.status === 'SUSPENDED'} onClick={() => void impersonate(company)}>
                        <LogIn className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => void updateStatus(company, company.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}>
                        {company.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Delete" onClick={() => void deleteCompany(company)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Pagination
          page={companies?.page ?? query.page}
          totalPages={companies?.totalPages ?? 1}
          total={companies?.total ?? 0}
          onPage={(page) => updateQuery({ page })}
        />
      </Card>

      <CompanyDialog
        open={!!companyDialog}
        mode={companyDialog?.mode ?? 'create'}
        company={companyDialog?.company}
        onOpenChange={(open) => !open && setCompanyDialog(null)}
        onSaved={load}
      />
      <ImpersonationDialog result={impersonation} onOpenChange={(open) => !open && setImpersonation(null)} />
    </>
  );
}

function CompanyDialog({
  open,
  mode,
  company,
  onOpenChange,
  onSaved,
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
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address ?? '',
      gstNumber: company.gstNumber ?? '',
      website: company.website ?? '',
      plan: company.plan,
    } : emptyCompany);
  }, [company, open]);

  const setField = (key: keyof CompanyForm, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      if (mode === 'create') {
        await superAdminApi.createCompany(token, form);
        toast.success('Company created');
      } else if (company) {
        await superAdminApi.updateCompany(token, company._id, form);
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
          <TextField id="company-name" label="Company Name" value={form.name} onChange={(value) => setField('name', value)} required />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField id="company-email" label="Email" type="email" value={form.email} onChange={(value) => setField('email', value)} required />
            <TextField id="company-phone" label="Phone" value={form.phone} onChange={(value) => setField('phone', value)} required />
          </div>
          <TextField id="company-address" label="Address" value={form.address} onChange={(value) => setField('address', value)} required />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField id="company-gst" label="GST Number" value={form.gstNumber} onChange={(value) => setField('gstNumber', value)} />
            <TextField id="company-website" label="Website" value={form.website} onChange={(value) => setField('website', value)} />
          </div>
          <SimpleSelect label="Plan" value={form.plan} onChange={(plan) => setForm((current) => ({ ...current, plan }))} options={PLANS.map((plan) => ({ value: plan, label: plan }))} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <SubmitButton loading={loading}>{mode === 'create' ? 'Create Company' : 'Save Changes'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ImpersonationDialog({ result, onOpenChange }: { result: ImpersonationResult | null; onOpenChange: (open: boolean) => void }) {
  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.token);
    toast.success('Token copied');
  };

  return (
    <Dialog open={!!result} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Impersonation Token</DialogTitle>
          <DialogDescription>Use this token for the selected company admin session.</DialogDescription>
        </DialogHeader>
        {result ? (
          <div className="space-y-4">
            <div className="rounded-md border bg-muted p-3 text-sm">
              <div className="font-medium">{result.companyName}</div>
              <div className="text-muted-foreground">{result.userName}</div>
            </div>
            <textarea readOnly value={result.token} className="h-36 w-full resize-none rounded-md border bg-background p-3 font-mono text-xs" />
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={copy}><Copy className="size-4" /> Copy Token</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
