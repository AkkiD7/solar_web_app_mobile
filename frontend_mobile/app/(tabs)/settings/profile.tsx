import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { InputField } from '../../../shared/ui/InputField';
import { Button } from '../../../shared/ui/Button';
import { ScreenHeader } from '../../../shared/ui/ScreenHeader';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { Feather } from '../../../shared/ui/icons';
import { useAuthStore } from '../../../features/auth/authStore';
import { useCompanyProfile, useUpdateCompanyProfile } from '../../../features/settings/useSettings';
import { getInitials, solarTheme } from '../../../shared/theme';

export default function SettingsProfileScreen() {
  const { data, isLoading, isError, refetch } = useCompanyProfile();
  const updateProfile = useUpdateCompanyProfile();
  const patchUser = useAuthStore((state) => state.patchUser);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: '',
    website: '',
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setForm({
      name: data.name ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      address: data.address ?? '',
      gstNumber: data.gstNumber ?? '',
      website: data.website ?? '',
    });
  }, [data]);

  const handleSave = async () => {
    try {
      const updated = await updateProfile.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        gstNumber: form.gstNumber.trim() || undefined,
        website: form.website.trim() || undefined,
      });

      await patchUser({
        companyName: updated.name,
        companyLogo: updated.logoUrl ?? null,
      });

      setIsEditing(false);
      Alert.alert('Saved', 'Company profile updated successfully.');
    } catch (error: any) {
      Alert.alert('Could not save profile', error?.response?.data?.message ?? 'Please try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
        <ScreenHeader
          title="Company Profile"
          subtitle="We could not load your company profile."
          onBack={() => router.back()}
        />
        <View className="px-5 pt-3">
          <EmptyState
            tone="danger"
            icon="office-building-cog-outline"
            title="Profile unavailable"
            message="Please retry to load your company profile details."
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
        title="Company Profile"
        subtitle="Review and update your company details."
        onBack={() => router.back()}
        rightAction={
          !isEditing ? (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="px-4 py-3 rounded-2xl"
              style={{
                backgroundColor: solarTheme.colors.surface,
                borderWidth: 1,
                borderColor: solarTheme.colors.border,
              }}
            >
              <Text
                style={{
                  color: solarTheme.colors.primaryStrong,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <SurfaceCard style={{ padding: 18, marginBottom: 16 }}>
          <View className="items-center">
            {data.logoUrl ? (
              <Image source={{ uri: data.logoUrl }} className="w-24 h-24 rounded-3xl mb-4" />
            ) : (
              <View
                className="w-24 h-24 rounded-3xl items-center justify-center mb-4"
                style={{ backgroundColor: solarTheme.colors.primarySoft }}
              >
                <Text
                  style={{
                    color: solarTheme.colors.primaryStrong,
                    fontSize: 26,
                    fontWeight: '800',
                  }}
                >
                  {getInitials(data.name)}
                </Text>
              </View>
            )}

            <Text style={{ color: solarTheme.colors.text, fontSize: 20, fontWeight: '800' }}>
              {data.name}
            </Text>
            <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, marginTop: 4 }}>
              Logo uploads are managed in the web app.
            </Text>
          </View>
        </SurfaceCard>

        <SurfaceCard style={{ padding: 16, marginBottom: 16 }}>
          <InputField
            label="Company Name"
            value={form.name}
            onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
            editable={isEditing}
            leftIcon={<Feather name="briefcase" size={18} color={solarTheme.colors.textSoft} />}
          />
          <InputField
            label="Email"
            value={form.email}
            onChangeText={(value) => setForm((current) => ({ ...current, email: value }))}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={isEditing}
            leftIcon={<Feather name="mail" size={18} color={solarTheme.colors.textSoft} />}
          />
          <InputField
            label="Phone"
            value={form.phone}
            onChangeText={(value) => setForm((current) => ({ ...current, phone: value }))}
            keyboardType="phone-pad"
            editable={isEditing}
            leftIcon={<Feather name="phone" size={18} color={solarTheme.colors.textSoft} />}
          />
          <InputField
            label="Address"
            value={form.address}
            onChangeText={(value) => setForm((current) => ({ ...current, address: value }))}
            editable={isEditing}
            multiline
            numberOfLines={3}
            leftIcon={<Feather name="map-pin" size={18} color={solarTheme.colors.textSoft} />}
          />
          <InputField
            label="GST Number"
            value={form.gstNumber}
            onChangeText={(value) => setForm((current) => ({ ...current, gstNumber: value }))}
            editable={isEditing}
            leftIcon={<Feather name="hash" size={18} color={solarTheme.colors.textSoft} />}
          />
          <InputField
            label="Website"
            value={form.website}
            onChangeText={(value) => setForm((current) => ({ ...current, website: value }))}
            autoCapitalize="none"
            editable={isEditing}
            leftIcon={<Feather name="globe" size={18} color={solarTheme.colors.textSoft} />}
            containerStyle={{ marginBottom: 0 }}
          />
        </SurfaceCard>

        {isEditing ? (
          <View className="flex-row gap-3 mt-2">
            <View className="flex-1">
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => {
                  setForm({
                    name: data.name ?? '',
                    email: data.email ?? '',
                    phone: data.phone ?? '',
                    address: data.address ?? '',
                    gstNumber: data.gstNumber ?? '',
                    website: data.website ?? '',
                  });
                  setIsEditing(false);
                }}
              />
            </View>
            <View className="flex-1">
              <Button title="Save Changes" loading={updateProfile.isPending} onPress={handleSave} />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
