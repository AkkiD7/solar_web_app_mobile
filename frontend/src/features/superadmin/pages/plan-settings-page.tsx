import { Check, RefreshCw, Settings } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage, superAdminApi } from '../api';
import { useSuperAdminAuth } from '../auth';
import { EmptyState, LoadingState, PageHeader, SubmitButton } from '../components/common';
import type { Plan, PlanConfig } from '../types';
import { PLANS } from '../types';

type PlanDraft = {
  maxLeads: number;
  maxQuotes: number;
  maxUsers: number;
  features: string;
};

const fallbackDrafts: Record<Plan, PlanDraft> = {
  FREE: { maxLeads: 50, maxQuotes: 100, maxUsers: 2, features: 'leads, quotes' },
  STARTER: { maxLeads: 500, maxQuotes: 1000, maxUsers: 10, features: 'leads, quotes, pdf_branding' },
  PRO: { maxLeads: -1, maxQuotes: -1, maxUsers: -1, features: 'leads, quotes, pdf_branding, analytics, export' },
};

export function PlanSettingsPage() {
  const { token } = useSuperAdminAuth();
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [drafts, setDrafts] = useState<Record<Plan, PlanDraft>>(fallbackDrafts);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Plan | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await superAdminApi.planConfigs(token);
      setPlans(result);
      setDrafts((current) => {
        const next = { ...current };
        result.forEach((plan) => {
          next[plan.plan] = {
            maxLeads: plan.maxLeads,
            maxQuotes: plan.maxQuotes,
            maxUsers: plan.maxUsers,
            features: plan.features.join(', '),
          };
        });
        return next;
      });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load plan settings'));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (event: FormEvent, plan: Plan) => {
    event.preventDefault();
    if (!token) return;
    setSaving(plan);
    try {
      const draft = drafts[plan];
      await superAdminApi.updatePlanConfig(token, plan, {
        maxLeads: draft.maxLeads,
        maxQuotes: draft.maxQuotes,
        maxUsers: draft.maxUsers,
        features: draft.features.split(',').map((item) => item.trim()).filter(Boolean),
      });
      toast.success(`${plan} updated`);
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update plan'));
    } finally {
      setSaving(null);
    }
  };

  const updateDraft = (plan: Plan, updates: Partial<PlanDraft>) => {
    setDrafts((current) => ({ ...current, [plan]: { ...current[plan], ...updates } }));
  };

  return (
    <>
      <PageHeader
        title="Plan Settings"
        description="Update lead, quote, user, and feature limits used by plan gating."
        actions={<Button variant="outline" onClick={load}><RefreshCw className="size-4" /> Refresh</Button>}
      />
      {loading && !plans.length ? (
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
                  <form onSubmit={(event) => void save(event, plan)} className="space-y-4">
                    {[
                      ['Max Leads', 'maxLeads'],
                      ['Max Quotes', 'maxQuotes'],
                      ['Max Users', 'maxUsers'],
                    ].map(([label, key]) => (
                      <div key={key} className="grid gap-2">
                        <Label>{label}</Label>
                        <Input
                          type="number"
                          value={draft[key as 'maxLeads' | 'maxQuotes' | 'maxUsers']}
                          onChange={(event) => updateDraft(plan, { [key]: Number(event.target.value) } as Partial<PlanDraft>)}
                        />
                      </div>
                    ))}
                    <div className="grid gap-2">
                      <Label>Features</Label>
                      <Input value={draft.features} onChange={(event) => updateDraft(plan, { features: event.target.value })} />
                    </div>
                    <SubmitButton loading={saving === plan}>
                      <Check className="size-4" />
                      Save Plan
                    </SubmitButton>
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
