import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { formatCurrency } from '../../../shared/utils/format';
import { calculateQuote } from '../utils/calculateQuote';
import type { CreateQuoteRequest } from '../types';

const schema = yup.object({
  systemSizeKW: yup.number().typeError('Required').positive('Must be > 0').required('Required'),
  panelCostPerKW: yup.number().typeError('Required').min(0, 'Must be >= 0').required('Required'),
  inverterCost: yup.number().typeError('Required').min(0, 'Must be >= 0').required('Required'),
  installationCost: yup.number().typeError('Required').min(0, 'Must be >= 0').required('Required'),
});

interface QuoteFormProps {
  leadId: string;
  onSubmit: (data: CreateQuoteRequest) => void;
  isLoading?: boolean;
}

export default function QuoteForm({ leadId, onSubmit, isLoading }: QuoteFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Omit<CreateQuoteRequest, 'leadId'>>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      systemSizeKW: undefined,
      panelCostPerKW: undefined,
      inverterCost: undefined,
      installationCost: undefined,
    },
  });

  const values = watch();
  const preview = calculateQuote({
    systemSizeKW: values.systemSizeKW || 0,
    panelCostPerKW: values.panelCostPerKW || 0,
    inverterCost: values.inverterCost || 0,
    installationCost: values.installationCost || 0,
  });

  const handleFormSubmit = (data: Omit<CreateQuoteRequest, 'leadId'>) => {
    onSubmit({ ...data, leadId });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="q-system-size" className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">System Size (kW) *</Label>
          <Input
            id="q-system-size"
            type="number"
            step="0.1"
            placeholder="5"
            {...register('systemSizeKW', { valueAsNumber: true })}
          />
          {errors.systemSizeKW && <p className="text-xs text-danger font-medium mt-1 ml-1">{errors.systemSizeKW.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="q-panel-cost" className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Panel Cost / kW (₹) *</Label>
          <Input
            id="q-panel-cost"
            type="number"
            placeholder="30000"
            {...register('panelCostPerKW', { valueAsNumber: true })}
          />
          {errors.panelCostPerKW && <p className="text-xs text-danger font-medium mt-1 ml-1">{errors.panelCostPerKW.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="q-inverter" className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Inverter Cost (₹) *</Label>
          <Input
            id="q-inverter"
            type="number"
            placeholder="50000"
            {...register('inverterCost', { valueAsNumber: true })}
          />
          {errors.inverterCost && <p className="text-xs text-danger font-medium mt-1 ml-1">{errors.inverterCost.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="q-install" className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Installation Cost (₹) *</Label>
          <Input
            id="q-install"
            type="number"
            placeholder="20000"
            {...register('installationCost', { valueAsNumber: true })}
          />
          {errors.installationCost && <p className="text-xs text-danger font-medium mt-1 ml-1">{errors.installationCost.message}</p>}
        </div>
      </div>

      {/* Live Preview */}
      {preview.total > 0 && (
        <div className="bg-gradient-to-br from-primary-soft to-white rounded-[16px] p-5 border border-border/60">
          <p className="text-[10px] font-black tracking-widest uppercase text-primary-strong mb-4">Live Preview</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-textMuted font-medium">
              <span>Panel Cost</span>
              <span className="text-text font-bold">{formatCurrency(preview.panelCost)}</span>
            </div>
            <div className="flex justify-between text-textMuted font-medium">
              <span>Inverter</span>
              <span className="text-text font-bold">{formatCurrency(values.inverterCost || 0)}</span>
            </div>
            <div className="flex justify-between text-textMuted font-medium">
              <span>Installation</span>
              <span className="text-text font-bold">{formatCurrency(values.installationCost || 0)}</span>
            </div>
            <div className="border-t border-border pt-3 mt-1 flex justify-between font-black text-[18px] text-text">
              <span>Total</span>
              <span>{formatCurrency(preview.total)}</span>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? 'Creating Quote...' : 'Create Quote'}
      </Button>
    </form>
  );
}
