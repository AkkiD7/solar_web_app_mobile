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
import { Feather } from '../../../shared/ui/icons';
import { useQuoteSettings, useUpdateQuoteSettings } from '../../../features/settings/useSettings';
import { solarTheme } from '../../../shared/theme';

export default function SettingsBrandingScreen() {
  const { data, isLoading, isError, refetch } = useQuoteSettings();
  const updateQuoteSettings = useUpdateQuoteSettings();
  const [form, setForm] = useState({
    headerText: '',
    footerText: '',
  });

  useEffect(() => {
    setForm({
      headerText: data?.headerText ?? '',
      footerText: data?.footerText ?? '',
    });
  }, [data?.footerText, data?.headerText]);

  const handleSave = async () => {
    try {
      await updateQuoteSettings.mutateAsync({
        headerText: form.headerText.trim() || undefined,
        footerText: form.footerText.trim() || undefined,
      });
      Alert.alert('Saved', 'Quote branding updated successfully.');
    } catch (error: any) {
      Alert.alert('Could not save branding', error?.response?.data?.message ?? 'Please try again.');
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
          title="Quote Branding"
          subtitle="We could not load branding settings."
          onBack={() => router.back()}
        />
        <View className="px-5 pt-3">
          <EmptyState
            tone="danger"
            icon="palette-outline"
            title="Branding unavailable"
            message="Please retry to load your quote branding settings."
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
        title="Quote Branding"
        subtitle="Control the text shown on your quote PDFs."
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <SurfaceCard style={{ padding: 16, marginBottom: 16 }}>
          <Text style={{ color: solarTheme.colors.text, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>
            Media uploads
          </Text>
          <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, lineHeight: 22 }}>
            Logo and signature uploads are handled in the web app. Mobile lets you manage the quote header and footer text.
          </Text>
        </SurfaceCard>

        <SurfaceCard style={{ padding: 16, marginBottom: 18 }}>
          <InputField
            label="Header Text"
            value={form.headerText}
            onChangeText={(value) => setForm((current) => ({ ...current, headerText: value }))}
            placeholder="Professional solar installation services"
            multiline
            numberOfLines={3}
            leftIcon={<Feather name="type" size={18} color={solarTheme.colors.textSoft} />}
          />
          <InputField
            label="Footer Text"
            value={form.footerText}
            onChangeText={(value) => setForm((current) => ({ ...current, footerText: value }))}
            placeholder="Thank you for considering our solar proposal."
            multiline
            numberOfLines={4}
            leftIcon={<Feather name="file-text" size={18} color={solarTheme.colors.textSoft} />}
            containerStyle={{ marginBottom: 0 }}
          />
        </SurfaceCard>

        <Button title="Save Branding" loading={updateQuoteSettings.isPending} onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}
