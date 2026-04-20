import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '../../../shared/ui/Button';
import { ScreenHeader } from '../../../shared/ui/ScreenHeader';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { usePreferences, useUpdatePreferences } from '../../../features/settings/useSettings';
import { solarTheme } from '../../../shared/theme';

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View className="mb-5">
      <Text
        style={{
          color: solarTheme.colors.textMuted,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 1.1,
          textTransform: 'uppercase',
          marginBottom: 10,
          marginLeft: 4,
        }}
      >
        {label}
      </Text>
      <SurfaceCard style={{ padding: 8 }}>
        {options.map((option, index) => {
          const active = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              className="rounded-2xl px-4 py-4"
              style={{
                backgroundColor: active ? solarTheme.colors.primarySoft : 'transparent',
                borderWidth: active ? 1 : 0,
                borderColor: active ? '#eccbb2' : 'transparent',
                marginBottom: index < options.length - 1 ? 6 : 0,
              }}
            >
              <Text
                style={{
                  color: active ? solarTheme.colors.primaryStrong : solarTheme.colors.text,
                  fontSize: 15,
                  fontWeight: active ? '700' : '600',
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </SurfaceCard>
    </View>
  );
}

export default function SettingsPreferencesScreen() {
  const { data, isLoading, isError, refetch } = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const [form, setForm] = useState({
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    language: 'en',
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setForm({
      currency: data.currency ?? 'INR',
      dateFormat: data.dateFormat ?? 'DD/MM/YYYY',
      language: data.language ?? 'en',
    });
  }, [data]);

  const handleSave = async () => {
    try {
      await updatePreferences.mutateAsync(form);
      Alert.alert('Saved', 'Preferences updated successfully.');
    } catch (error: any) {
      Alert.alert('Could not save preferences', error?.response?.data?.message ?? 'Please try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
        <ScreenHeader
          title="Preferences"
          subtitle="We could not load your preferences."
          onBack={() => router.back()}
        />
        <View className="px-5 pt-3">
          <EmptyState
            tone="danger"
            icon="tune-variant"
            title="Preferences unavailable"
            message="Please retry to load your company preferences."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
      <ScreenHeader
        title="Preferences"
        subtitle="Choose how values and dates are shown in the app."
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <OptionGroup
          label="Currency"
          value={form.currency}
          onChange={(value) => setForm((current) => ({ ...current, currency: value }))}
          options={[
            { label: 'INR - Indian Rupee', value: 'INR' },
            { label: 'USD - US Dollar', value: 'USD' },
            { label: 'EUR - Euro', value: 'EUR' },
          ]}
        />

        <OptionGroup
          label="Date Format"
          value={form.dateFormat}
          onChange={(value) => setForm((current) => ({ ...current, dateFormat: value }))}
          options={[
            { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
            { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
            { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
          ]}
        />

        <OptionGroup
          label="Language"
          value={form.language}
          onChange={(value) => setForm((current) => ({ ...current, language: value }))}
          options={[
            { label: 'English', value: 'en' },
            { label: 'Hindi', value: 'hi' },
            { label: 'Marathi', value: 'mr' },
          ]}
        />

        <Button title="Save Preferences" loading={updatePreferences.isPending} onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}
