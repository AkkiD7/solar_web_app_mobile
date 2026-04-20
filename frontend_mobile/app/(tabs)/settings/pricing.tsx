import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { InputField } from '../../../shared/ui/InputField';
import { Button } from '../../../shared/ui/Button';
import { ScreenHeader } from '../../../shared/ui/ScreenHeader';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { Feather, MaterialIcons } from '../../../shared/ui/icons';
import { usePricingConfig, useUpdatePricingConfig } from '../../../features/settings/useSettings';
import { solarTheme } from '../../../shared/theme';

export default function SettingsPricingScreen() {
  const { data, isLoading, isError, refetch } = usePricingConfig();
  const updatePricingConfig = useUpdatePricingConfig();
  const [form, setForm] = useState({
    defaultPanelCostPerKW: '',
    defaultInverterCost: '',
    defaultInstallationCost: '',
  });

  useEffect(() => {
    setForm({
      defaultPanelCostPerKW:
        data?.defaultPanelCostPerKW != null ? String(data.defaultPanelCostPerKW) : '',
      defaultInverterCost: data?.defaultInverterCost != null ? String(data.defaultInverterCost) : '',
      defaultInstallationCost:
        data?.defaultInstallationCost != null ? String(data.defaultInstallationCost) : '',
    });
  }, [
    data?.defaultInstallationCost,
    data?.defaultInverterCost,
    data?.defaultPanelCostPerKW,
  ]);

  const handleSave = async () => {
    try {
      await updatePricingConfig.mutateAsync({
        defaultPanelCostPerKW: Number(form.defaultPanelCostPerKW || 0),
        defaultInverterCost: Number(form.defaultInverterCost || 0),
        defaultInstallationCost: Number(form.defaultInstallationCost || 0),
      });
      Alert.alert('Saved', 'Pricing defaults updated successfully.');
    } catch (error: any) {
      Alert.alert('Could not save pricing', error?.response?.data?.message ?? 'Please try again.');
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
          title="Pricing Defaults"
          subtitle="We could not load pricing defaults."
          onBack={() => router.back()}
        />
        <View className="px-5 pt-3">
          <EmptyState
            tone="danger"
            icon="cash-remove"
            title="Pricing unavailable"
            message="Please retry to load your quote pricing defaults."
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
        title="Pricing Defaults"
        subtitle="Used to pre-fill new quote forms."
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <SurfaceCard style={{ padding: 16, marginBottom: 16 }}>
          <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, lineHeight: 22 }}>
            These values appear automatically when you create a new quote, but you can still override them per quote.
          </Text>
        </SurfaceCard>

        <SurfaceCard style={{ padding: 16, marginBottom: 18 }}>
          <InputField
            label="Default Panel Cost per kW"
            value={form.defaultPanelCostPerKW}
            onChangeText={(value) => setForm((current) => ({ ...current, defaultPanelCostPerKW: value }))}
            keyboardType="number-pad"
            placeholder="35000"
            leftIcon={<MaterialIcons name="grid-view" size={18} color={solarTheme.colors.textSoft} />}
          />
          <InputField
            label="Default Inverter Cost"
            value={form.defaultInverterCost}
            onChangeText={(value) => setForm((current) => ({ ...current, defaultInverterCost: value }))}
            keyboardType="number-pad"
            placeholder="18000"
            leftIcon={<Feather name="zap" size={18} color={solarTheme.colors.textSoft} />}
          />
          <InputField
            label="Default Installation Cost"
            value={form.defaultInstallationCost}
            onChangeText={(value) => setForm((current) => ({ ...current, defaultInstallationCost: value }))}
            keyboardType="number-pad"
            placeholder="12000"
            leftIcon={<Feather name="tool" size={18} color={solarTheme.colors.textSoft} />}
            containerStyle={{ marginBottom: 0 }}
          />
        </SurfaceCard>

        <Button title="Save Pricing" loading={updatePricingConfig.isPending} onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}
