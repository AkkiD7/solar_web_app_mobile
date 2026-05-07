import { Check, RefreshCw, Settings } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/features/shared/api/client';
import { useApiQuery } from '@/features/shared/hooks/use-api-query';
import { EmptyState } from '@/features/shared/components/empty-state';
import { LoadingState } from '@/features/shared/components/loading-state';
import { PageHeader } from '@/features/shared/components/page-header';
import { SubmitButton } from '@/features/shared/components/form-fields';
import * as plansApi from './api';
import type { Plan, PlanConfig } from './types';
import { PLANS } from './types';

type PlanDraft = { maxLeads: number; maxQuotes: number; maxUsers: number; features: string };

const fallbackDrafts: Record<Plan, PlanDraft> = {
  FREE: { maxLeads: 50, maxQuotes: 100, maxUsers: 2, features: 'leads, quotes' },
  STARTER: { maxLeads: 500, maxQuotes: 1000, maxUsers: 10, features: 'leads, quotes, pdf_branding' },
  PRO: { maxLeads: -1, maxQuotes: -1, maxUsers: -1, features: 'leads, quotes, pdf_branding, analytics, export' },
};

export function PlanSettingsPage() {
  const { token } = useSuperAdminAuth();
  const [drafts, setDrafts] = useState<Record<Plan, PlanDraft>>(fallbackDrafts);
  const [saving, setSaving] = useState<Plan | null>(null);

  const { data: plans, loading, reload } = useApiQuery(
    async () => {
      const result = await plansApi.fetchPlanConfigs(token!);
      // Sync drafts with loaded data
      setDrafts((current) => {
        const next = { ...current };
        result.forEach((plan: PlanConfig) => {
          next[plan.plan] = { maxLeads: plan.maxLeads, maxQuotes: plan.maxQuotes, maxUsers: plan.maxUsers, features: plan.features.join(', ') };
        });
        return next;
      });
      return result;
    },
    [token],
    'Failed to load plan settings'
  );

  const save = async (event: FormEvent, plan: Plan) => {
    event.preventDefault();
    if (!token) return;
    setSaving(plan);
    try {
      const draft = drafts[plan];
      await plansApi.updatePlanConfig(token, plan, {
        maxLeads: draft.maxLeads, maxQuotes: draft.maxQuotes, maxUsers: draft.maxUsers,
        features: draft.features.split(',').map((i) => i.trim()).filter(Boolean),
      });
      toast.success(`${plan} updated`);
      await reload();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update plan'));
    } finally {
      setSaving(null);
    }
  };

  const updateDraft = (plan: Plan, updates: Partial<PlanDraft>) => {
    setDrafts((c) => ({ ...c, [plan]: { ...c[plan], ...updates } }));
  };

  return (
    <>
      <PageHeader
        title="Plan Settings"
        description="Update lead, quote, user, and feature limits used by plan gating."
        actions={<Button variant="outline" onClick={reload}><RefreshCw className="size-4" /> Refresh</Button>}
      />
      {loading && !plans?.length ? (
        <LoadingState rows={3} />
      ) : !PLANS.length ? (
        <EmptyState title="No plans configured." icon={Settings} />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {PLANS.map((plan) => {
            const draft = drafts[plan];
            return (
              <Card key={plan}>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle>{plan}</CardTitle>
                  <Badge variant={draft.maxUsers === -1 ? 'warning' : 'secondary'}>
                    {draft.maxUsers === -1 ? 'Unlimited users' : `${draft.maxUsers} users`}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => void save(e, plan)} className="space-y-4">
                    {([['Max Leads', 'maxLeads'], ['Max Quotes', 'maxQuotes'], ['Max Users', 'maxUsers']] as const).map(([label, key]) => (
                      <div key={key} className="grid gap-2">
                        <Label>{label}</Label>
                        <Input type="number" value={draft[key]} onChange={(e) => updateDraft(plan, { [key]: Number(e.target.value) })} />
                      </div>
                    ))}
                    <div className="grid gap-2">
                      <Label>Features</Label>
                      <Input value={draft.features} onChange={(e) => updateDraft(plan, { features: e.target.value })} />
                    </div>
                    <SubmitButton loading={saving === plan}><Check className="size-4" /> Save Plan</SubmitButton>
                  </form>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
