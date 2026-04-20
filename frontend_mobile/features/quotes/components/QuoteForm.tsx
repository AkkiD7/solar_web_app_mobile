import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { View, Text } from 'react-native';
import { InputField } from '../../../shared/ui/InputField';
import { Button } from '../../../shared/ui/Button';
import { formatCurrency } from '../../../shared/utils/format';
import { calculateQuote } from '../types';
import type { CreateQuoteDto } from '../types';
import { Feather, MaterialIcons } from '../../../shared/ui/icons';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { solarTheme } from '../../../shared/theme';

const schema = yup.object({
  systemSizeKW: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' || originalValue == null ? undefined : value))
    .moreThan(0, 'System size must be greater than 0')
    .required('System size is required'),
  panelCostPerKW: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' || originalValue == null ? undefined : value))
    .min(0, 'Panel cost must be 0 or more')
    .required('Panel cost is required'),
  inverterCost: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' || originalValue == null ? undefined : value))
    .min(0, 'Inverter cost must be 0 or more')
    .required('Inverter cost is required'),
  installationCost: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' || originalValue == null ? undefined : value))
    .min(0, 'Installation cost must be 0 or more')
    .required('Installation cost is required'),
  notes: yup.string().trim().optional(),
});

type QuoteFormValues = yup.InferType<typeof schema>;

interface QuoteFormProps {
  leadId: string;
  loading?: boolean;
  defaults?: Partial<CreateQuoteDto>;
  onSubmit: (data: CreateQuoteDto) => void | Promise<void>;
}

export function QuoteForm({ leadId, loading, defaults, onSubmit }: QuoteFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      systemSizeKW: defaults?.systemSizeKW,
      panelCostPerKW: defaults?.panelCostPerKW,
      inverterCost: defaults?.inverterCost,
      installationCost: defaults?.installationCost,
      notes: defaults?.notes ?? '',
    },
  });

  useEffect(() => {
    reset({
      systemSizeKW: defaults?.systemSizeKW,
      panelCostPerKW: defaults?.panelCostPerKW,
      inverterCost: defaults?.inverterCost,
      installationCost: defaults?.installationCost,
      notes: defaults?.notes ?? '',
    });
  }, [
    defaults?.installationCost,
    defaults?.inverterCost,
    defaults?.notes,
    defaults?.panelCostPerKW,
    defaults?.systemSizeKW,
    reset,
  ]);

  const values = watch();
  const preview = calculateQuote({
    systemSizeKW: values.systemSizeKW ?? 0,
    panelCostPerKW: values.panelCostPerKW ?? 0,
    inverterCost: values.inverterCost ?? 0,
    installationCost: values.installationCost ?? 0,
  });

  const submit = (formValues: QuoteFormValues) => {
    onSubmit({
      leadId,
      systemSizeKW: formValues.systemSizeKW,
      panelCostPerKW: formValues.panelCostPerKW,
      inverterCost: formValues.inverterCost,
      installationCost: formValues.installationCost,
      notes: formValues.notes?.trim() || undefined,
    });
  };

  return (
    <>
      <SurfaceCard style={{ padding: 16, marginBottom: 16 }}>
        <Controller
          control={control}
          name="systemSizeKW"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="System Size (kW) *"
              value={value == null ? '' : String(value)}
              onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
              onBlur={onBlur}
              placeholder="5.0"
              keyboardType="decimal-pad"
              error={errors.systemSizeKW?.message}
              leftIcon={<Feather name="sun" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />
        <Controller
          control={control}
          name="panelCostPerKW"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Panel Cost per kW *"
              value={value == null ? '' : String(value)}
              onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
              onBlur={onBlur}
              placeholder="35000"
              keyboardType="number-pad"
              error={errors.panelCostPerKW?.message}
              leftIcon={<MaterialIcons name="grid-view" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />
        <Controller
          control={control}
          name="inverterCost"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Inverter Cost *"
              value={value == null ? '' : String(value)}
              onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
              onBlur={onBlur}
              placeholder="18000"
              keyboardType="number-pad"
              error={errors.inverterCost?.message}
              leftIcon={<Feather name="zap" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />
        <Controller
          control={control}
          name="installationCost"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Installation Cost *"
              value={value == null ? '' : String(value)}
              onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
              onBlur={onBlur}
              placeholder="12000"
              keyboardType="number-pad"
              error={errors.installationCost?.message}
              leftIcon={<Feather name="tool" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />
      </SurfaceCard>

      <SurfaceCard style={{ padding: 16, marginBottom: 16 }}>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Notes"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Optional quote notes"
              multiline
              numberOfLines={4}
              error={errors.notes?.message}
              leftIcon={<Feather name="edit-3" size={18} color={solarTheme.colors.textSoft} />}
              containerStyle={{ marginBottom: 0 }}
            />
          )}
        />
      </SurfaceCard>

      <SurfaceCard tone="accent" style={{ padding: 16, marginBottom: 18 }}>
        <Text
          style={{
            color: solarTheme.colors.textMuted,
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1.1,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Cost Preview
        </Text>
        <View className="flex-row items-center justify-between mb-2">
          <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14 }}>Panel Cost</Text>
          <Text style={{ color: solarTheme.colors.text, fontSize: 14, fontWeight: '600' }}>
            {formatCurrency(preview.panelCost)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-2">
          <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14 }}>Inverter</Text>
          <Text style={{ color: solarTheme.colors.text, fontSize: 14, fontWeight: '600' }}>
            {formatCurrency(values.inverterCost)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14 }}>Installation</Text>
          <Text style={{ color: solarTheme.colors.text, fontSize: 14, fontWeight: '600' }}>
            {formatCurrency(values.installationCost)}
          </Text>
        </View>
        <View
          className="flex-row items-center justify-between mt-4 pt-4"
          style={{ borderTopWidth: 1, borderTopColor: '#ebd5c6' }}
        >
          <Text style={{ color: solarTheme.colors.primaryStrong, fontSize: 16, fontWeight: '700' }}>
            Total
          </Text>
          <Text style={{ color: solarTheme.colors.primaryStrong, fontSize: 24, fontWeight: '900' }}>
            {formatCurrency(preview.total)}
          </Text>
        </View>
      </SurfaceCard>

      <Button title="Create Quote" loading={loading} onPress={handleSubmit(submit as any)} />
    </>
  );
}
