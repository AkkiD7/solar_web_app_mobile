import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Textarea } from '../../../shared/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../../shared/ui/select';
import { LeadStatus, LEAD_STATUS_OPTIONS } from '../../../shared/constants/leadStatus';
import type { Lead, CreateLeadRequest } from '../types';

const schema = yup.object({
  name: yup.string().min(2, 'Min 2 characters').required('Name is required'),
  phone: yup.string().matches(/^\d{10}$/, 'Phone must be exactly 10 digits').required('Phone is required'),
  location: yup.string().optional(),
  status: yup.string().oneOf(Object.values(LeadStatus)).optional(),
  notes: yup.string().optional(),
  followUpDate: yup.string().optional(),
});

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit: (data: CreateLeadRequest) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function LeadForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save Lead',
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateLeadRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: defaultValues?.name || '',
      phone: defaultValues?.phone || '',
      location: defaultValues?.location || '',
      status: defaultValues?.status || LeadStatus.NEW,
      notes: defaultValues?.notes || '',
      followUpDate: defaultValues?.followUpDate
        ? new Date(defaultValues.followUpDate).toISOString().split('T')[0]
        : '',
    },
  });

  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="lead-name">Customer Name *</Label>
          <Input id="lead-name" placeholder="Ramesh Kumar" {...register('name')} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lead-phone">Phone Number *</Label>
          <Input id="lead-phone" placeholder="9876543210" maxLength={10} {...register('phone')} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="lead-location">Location</Label>
          <Input id="lead-location" placeholder="Mumbai, Maharashtra" {...register('location')} />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value as LeadStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-followup">Follow-up Date</Label>
        <Input id="lead-followup" type="date" {...register('followUpDate')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-notes">Notes</Label>
        <Textarea
          id="lead-notes"
          placeholder="Interested in 5kW system, has south-facing roof..."
          rows={3}
          {...register('notes')}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
