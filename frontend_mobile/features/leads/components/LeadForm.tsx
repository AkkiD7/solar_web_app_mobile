import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { View } from 'react-native';
import { InputField } from '../../../shared/ui/InputField';
import { Button } from '../../../shared/ui/Button';
import { Feather } from '../../../shared/ui/icons';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import type { CreateLeadDto, Lead } from '../types';
import { solarTheme } from '../../../shared/theme';

const schema = yup.object({
  name: yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
  phone: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, 'Phone must be exactly 10 digits')
    .required('Phone is required'),
  email: yup.string().trim().email('Enter a valid email').optional(),
  location: yup.string().trim().optional(),
  systemSizeKW: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' || originalValue == null ? undefined : value))
    .min(0, 'System size must be 0 or more')
    .optional(),
  notes: yup.string().trim().optional(),
});

type LeadFormValues = yup.InferType<typeof schema>;

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (data: CreateLeadDto) => void | Promise<void>;
}

export function LeadForm({ defaultValues, loading, submitLabel, onSubmit }: LeadFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: defaultValues?.name ?? '',
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      location: defaultValues?.location ?? '',
      systemSizeKW: defaultValues?.systemSizeKW,
      notes: defaultValues?.notes ?? '',
    },
  });

  const submit = (values: LeadFormValues) => {
    onSubmit({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() || undefined,
      location: values.location?.trim() || undefined,
      systemSizeKW: values.systemSizeKW,
      notes: values.notes?.trim() || undefined,
    });
  };

  return (
    <>
      <SurfaceCard style={{ padding: 16, marginBottom: 16 }}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Customer Name *"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ravi Kumar"
              error={errors.name?.message}
              leftIcon={<Feather name="user" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Phone *"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="9876543210"
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phone?.message}
              leftIcon={<Feather name="phone" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Email"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="customer@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
              leftIcon={<Feather name="mail" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Location"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mumbai, Maharashtra"
              error={errors.location?.message}
              leftIcon={<Feather name="map-pin" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />
        <Controller
          control={control}
          name="systemSizeKW"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="System Size (kW)"
              value={value == null ? '' : String(value)}
              onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
              onBlur={onBlur}
              placeholder="5.5"
              keyboardType="decimal-pad"
              error={errors.systemSizeKW?.message}
              leftIcon={<Feather name="sun" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />
      </SurfaceCard>

      <SurfaceCard style={{ padding: 16, marginBottom: 18 }}>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Notes"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Roof details, budget notes, site observations"
              multiline
              numberOfLines={4}
              error={errors.notes?.message}
              leftIcon={<Feather name="edit-3" size={18} color={solarTheme.colors.textSoft} />}
              containerStyle={{ marginBottom: 0 }}
            />
          )}
        />
      </SurfaceCard>

      <View style={{ marginBottom: 6 }}>
        <Button title={submitLabel} loading={loading} onPress={handleSubmit(submit as any)} />
      </View>
    </>
  );
}
