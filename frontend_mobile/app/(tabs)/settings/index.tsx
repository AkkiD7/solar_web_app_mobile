import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../../../features/auth/authStore';
import { useCompanyProfile } from '../../../features/settings/useSettings';
import { AppTopBar } from '../../../shared/ui/AppTopBar';
import { StatusPill } from '../../../shared/ui/StatusPill';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { Feather } from '../../../shared/ui/icons';
import { getInitials, solarTheme } from '../../../shared/theme';

function SettingRow({
  title,
  description,
  icon,
  onPress,
}: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
      <SurfaceCard className="flex-row items-center" style={{ padding: 16, marginBottom: 12 }}>
        <View
          className="w-11 h-11 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: solarTheme.colors.surfaceMuted }}
        >
          <Feather name={icon} size={18} color={solarTheme.colors.primaryStrong} />
        </View>

        <View className="flex-1 pr-3">
          <Text style={{ color: solarTheme.colors.text, fontSize: 16, fontWeight: '700' }}>
            {title}
          </Text>
          <Text
            style={{
              color: solarTheme.colors.textMuted,
              fontSize: 13,
              lineHeight: 20,
              marginTop: 4,
            }}
          >
            {description}
          </Text>
        </View>

        <Feather name="chevron-right" size={18} color={solarTheme.colors.textSoft} />
      </SurfaceCard>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: companyProfile } = useCompanyProfile();

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const companyName = companyProfile?.name ?? user?.companyName ?? 'Solar Contractor';
  const companyEmail = companyProfile?.email ?? user?.email ?? 'company@example.com';

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 118 }}
        showsVerticalScrollIndicator={false}
      >
        <AppTopBar subtitle="Workspace settings" />

        <View className="pb-4">
          <Text
            style={{
              color: solarTheme.colors.text,
              fontSize: 34,
              fontWeight: '800',
              letterSpacing: -0.8,
            }}
          >
            Settings
          </Text>
          <Text
            style={{
              color: solarTheme.colors.textMuted,
              fontSize: 14,
              marginTop: 6,
              marginBottom: 18,
            }}
          >
            Manage company details, branding, pricing, and preferences.
          </Text>

          <SurfaceCard style={{ padding: 18, marginBottom: 18 }}>
            <View className="flex-row items-center">
              {companyProfile?.logoUrl ? (
                <Image
                  source={{ uri: companyProfile.logoUrl }}
                  className="w-16 h-16 rounded-3xl mr-4"
                  resizeMode="cover"
                />
              ) : (
                <View
                  className="w-16 h-16 rounded-3xl items-center justify-center mr-4"
                  style={{ backgroundColor: solarTheme.colors.primarySoft }}
                >
                  <Text
                    style={{
                      color: solarTheme.colors.primaryStrong,
                      fontSize: 22,
                      fontWeight: '800',
                    }}
                  >
                    {getInitials(companyName)}
                  </Text>
                </View>
              )}

              <View className="flex-1 pr-3">
                <Text style={{ color: solarTheme.colors.text, fontSize: 20, fontWeight: '800' }}>
                  {companyName}
                </Text>
                <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, marginTop: 4 }}>
                  {companyEmail}
                </Text>
              </View>

              <StatusPill label={user?.plan ?? 'FREE'} tone="primary" />
            </View>
          </SurfaceCard>

          <SettingRow
            title="Company Profile"
            description="Edit your company name, contact details, address, GST number, and website."
            icon="briefcase"
            onPress={() => router.push('/(tabs)/settings/profile')}
          />
          <SettingRow
            title="Quote Branding"
            description="Customize the text that appears on your quote PDFs."
            icon="pen-tool"
            onPress={() => router.push('/(tabs)/settings/branding')}
          />
          <SettingRow
            title="Pricing Defaults"
            description="Set default panel, inverter, and installation costs for new quotes."
            icon="dollar-sign"
            onPress={() => router.push('/(tabs)/settings/pricing')}
          />
          <SettingRow
            title="Preferences"
            description="Choose your currency, date format, and language defaults."
            icon="sliders"
            onPress={() => router.push('/(tabs)/settings/preferences')}
          />

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-2 rounded-3xl py-4 items-center"
            style={{
              backgroundColor: solarTheme.colors.dangerSoft,
              borderWidth: 1,
              borderColor: '#f2c7c1',
            }}
          >
            <Text
              style={{
                color: solarTheme.colors.danger,
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
