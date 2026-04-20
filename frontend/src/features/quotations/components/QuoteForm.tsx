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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="q-system-size">System Size (kW) *</Label>
          <Input
            id="q-system-size"
            type="number"
            step="0.1"
            placeholder="5"
            {...register('systemSizeKW', { valueAsNumber: true })}
          />
          {errors.systemSizeKW && <p className="text-xs text-red-500">{errors.systemSizeKW.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="q-panel-cost">Panel Cost / kW (₹) *</Label>
          <Input
            id="q-panel-cost"
            type="number"
            placeholder="30000"
            {...register('panelCostPerKW', { valueAsNumber: true })}
          />
          {errors.panelCostPerKW && <p className="text-xs text-red-500">{errors.panelCostPerKW.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="q-inverter">Inverter Cost (₹) *</Label>
          <Input
            id="q-inverter"
            type="number"
            placeholder="50000"
            {...register('inverterCost', { valueAsNumber: true })}
          />
          {errors.inverterCost && <p className="text-xs text-red-500">{errors.inverterCost.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="q-install">Installation Cost (₹) *</Label>
          <Input
            id="q-install"
            type="number"
            placeholder="20000"
            {...register('installationCost', { valueAsNumber: true })}
          />
          {errors.installationCost && <p className="text-xs text-red-500">{errors.installationCost.message}</p>}
        </div>
      </div>

      {/* Live Preview */}
      {preview.total > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-3">Live Preview</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Panel Cost</span>
              <span className="font-medium">{formatCurrency(preview.panelCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Inverter</span>
              <span className="font-medium">{formatCurrency(values.inverterCost || 0)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Installation</span>
              <span className="font-medium">{formatCurrency(values.installationCost || 0)}</span>
            </div>
            <div className="border-t border-orange-200 pt-2 flex justify-between font-bold text-base text-orange-700">
              <span>Total</span>
              <span>{formatCurrency(preview.total)}</span>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Quote...' : 'Create Quote'}
      </Button>
    </form>
  );
}
