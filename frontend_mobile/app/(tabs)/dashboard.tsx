import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDashboardStats } from '../../features/dashboard/useDashboard';
import { useAuthStore } from '../../features/auth/authStore';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { AppTopBar } from '../../shared/ui/AppTopBar';
import { Button } from '../../shared/ui/Button';
import { EmptyState } from '../../shared/ui/EmptyState';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { StatusPill } from '../../shared/ui/StatusPill';
import { SurfaceCard } from '../../shared/ui/SurfaceCard';
import { Feather, MaterialIcons } from '../../shared/ui/icons';
import { formatCurrency, formatShortDate } from '../../shared/utils/format';
import { getLeadStatusLabel, type LeadStatus } from '../../shared/constants/leadStatus';
import { getInitials, solarTheme } from '../../shared/theme';

function HeaderActionButton({
  icon,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-10 h-10 items-center justify-center rounded-full"
      style={{
        backgroundColor: solarTheme.colors.surface,
        borderWidth: 1,
        borderColor: solarTheme.colors.border,
      }}
    >
      <Feather name={icon} size={17} color={solarTheme.colors.primaryStrong} />
    </TouchableOpacity>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string | number;
}) {
  return (
    <SurfaceCard className="flex-1" style={{ padding: 16 }}>
      <View
        className="w-9 h-9 rounded-2xl items-center justify-center mb-4"
        style={{ backgroundColor: solarTheme.colors.surfaceMuted }}
      >
        <MaterialIcons name={icon} size={18} color={solarTheme.colors.primaryStrong} />
      </View>
      <Text style={{ color: solarTheme.colors.textMuted, fontSize: 13, marginBottom: 6 }}>
        {label}
      </Text>
      <Text style={{ color: solarTheme.colors.text, fontSize: 18, fontWeight: '800' }}>{value}</Text>
    </SurfaceCard>
  );
}

function DashboardSkeleton() {
  return (
    <View className="px-5 pt-2">
      <View className="flex-row gap-3 mb-3">
        <SurfaceCard className="flex-1" style={{ padding: 16 }}>
          <View className="w-9 h-9 rounded-2xl mb-4" style={{ backgroundColor: '#f1e6df' }} />
          <View className="h-3 rounded-full mb-3" style={{ width: 76, backgroundColor: '#efe4dd' }} />
          <View className="h-6 rounded-full" style={{ width: 52, backgroundColor: '#e8d9cf' }} />
        </SurfaceCard>
        <SurfaceCard className="flex-1" style={{ padding: 16 }}>
          <View className="w-9 h-9 rounded-2xl mb-4" style={{ backgroundColor: '#f1e6df' }} />
          <View className="h-3 rounded-full mb-3" style={{ width: 76, backgroundColor: '#efe4dd' }} />
          <View className="h-6 rounded-full" style={{ width: 52, backgroundColor: '#e8d9cf' }} />
        </SurfaceCard>
      </View>
      <SurfaceCard style={{ padding: 20, marginBottom: 22 }}>
        <View className="h-3 rounded-full mb-4" style={{ width: 110, backgroundColor: '#efe4dd' }} />
        <View className="h-8 rounded-full" style={{ width: 150, backgroundColor: '#e8d9cf' }} />
      </SurfaceCard>
      <SurfaceCard style={{ padding: 18 }}>
        <View className="h-4 rounded-full mb-5" style={{ width: 130, backgroundColor: '#efe4dd' }} />
        {[1, 2, 3].map((item) => (
          <View key={item} className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full mr-3" style={{ backgroundColor: '#f1e6df' }} />
              <View>
                <View className="h-3 rounded-full mb-2" style={{ width: 110, backgroundColor: '#efe4dd' }} />
                <View className="h-3 rounded-full" style={{ width: 70, backgroundColor: '#f1e6df' }} />
              </View>
            </View>
            <View className="h-7 rounded-full" style={{ width: 64, backgroundColor: '#efe4dd' }} />
          </View>
        ))}
      </SurfaceCard>
    </View>
  );
}

export default function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: stats, isLoading, isError, refetch, isRefetching } = useDashboardStats();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const winRate = stats?.totalLeads ? Math.round((stats.wonDeals / stats.totalLeads) * 100) : 0;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 118 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={solarTheme.colors.primaryStrong}
            colors={[solarTheme.colors.primaryStrong]}
          />
        }
      >
        <AppTopBar
          subtitle={`Namaste, ${firstName} 👋`}
          logoUrl={user?.companyLogo}
          trailing={
            <View className="items-end">
              <HeaderActionButton icon="bell" onPress={() => undefined} />
              <TouchableOpacity onPress={handleLogout} className="mt-2">
                <Text
                  style={{
                    color: solarTheme.colors.primary,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  Sign out
                </Text>
              </TouchableOpacity>
            </View>
          }
        />

        {isLoading ? (
          <DashboardSkeleton />
        ) : isError || !stats ? (
          <View className="px-5 pt-3">
            <EmptyState
              tone="danger"
              icon="cloud-alert-outline"
              title="Dashboard unavailable"
              message="We could not load your latest numbers. Pull to refresh or retry below."
              actionLabel="Retry"
              onAction={() => refetch()}
            />
          </View>
        ) : (
          <View className="px-5 pt-2">
            <View className="flex-row gap-3 mb-3">
              <StatCard icon="groups" label="Total Leads" value={stats.totalLeads} />
              <StatCard icon="emoji-events" label="Won Deals" value={stats.wonDeals} />
            </View>

            <SurfaceCard style={{ padding: 20, marginBottom: 24 }}>
              <View className="flex-row items-start justify-between mb-4">
                <View
                  className="w-10 h-10 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: solarTheme.colors.surfaceMuted }}
                >
                  <MaterialIcons name="currency-rupee" size={20} color={solarTheme.colors.primaryStrong} />
                </View>
                <StatusPill label={`${winRate}% won`} tone="success" />
              </View>

              <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, marginBottom: 6 }}>
                Revenue (This Month)
              </Text>
              <Text
                style={{
                  color: solarTheme.colors.text,
                  fontSize: 22,
                  fontWeight: '900',
                }}
              >
                {formatCurrency(stats.totalRevenue)}
              </Text>
            </SurfaceCard>

            {stats.totalLeads === 0 ? (
              <EmptyState
                title="No leads yet"
                message="Start by adding your first lead. Once you do, your pipeline and revenue summary will show up here."
                actionLabel="Go To Leads"
                onAction={() => router.push('/(tabs)/leads')}
              />
            ) : (
              <>
                <SectionHeader
                  title="Today's Follow-ups"
                  actionLabel="View All"
                  onAction={() => router.push('/(tabs)/leads')}
                />

                <View className="mt-4 mb-6 gap-3">
                  {stats.recentLeads.slice(0, 3).map((lead) => (
                    <TouchableOpacity
                      key={lead._id}
                      activeOpacity={0.88}
                      onPress={() => router.push(`/(tabs)/lead/${lead._id}`)}
                    >
                      <SurfaceCard className="flex-row items-center justify-between" style={{ padding: 14 }}>
                        <View className="flex-row items-center flex-1 pr-3">
                          <View
                            className="w-11 h-11 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: solarTheme.colors.surfaceMuted }}
                          >
                            <Text
                              style={{
                                color: solarTheme.colors.primaryStrong,
                                fontSize: 14,
                                fontWeight: '800',
                              }}
                            >
                              {getInitials(lead.name)}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text
                              style={{
                                color: solarTheme.colors.text,
                                fontSize: 16,
                                fontWeight: '700',
                              }}
                            >
                              {lead.name}
                            </Text>
                            <Text
                              style={{
                                color: solarTheme.colors.textMuted,
                                fontSize: 13,
                                marginTop: 4,
                              }}
                            >
                              Added {formatShortDate(lead.createdAt)}
                            </Text>
                          </View>
                        </View>
                        <StatusPill
                          label={getLeadStatusLabel(lead.status as LeadStatus)}
                          status={lead.status as LeadStatus}
                          compact
                        />
                      </SurfaceCard>
                    </TouchableOpacity>
                  ))}
                </View>

                {Object.keys(stats.statusBreakdown ?? {}).length > 0 ? (
                  <>
                    <SectionHeader title="Pipeline Snapshot" />
                    <SurfaceCard style={{ padding: 18, marginTop: 16 }}>
                      {Object.entries(stats.statusBreakdown).map(([status, count], index, array) => (
                        <View
                          key={status}
                          className="flex-row items-center justify-between"
                          style={{
                            paddingVertical: 10,
                            borderBottomWidth: index < array.length - 1 ? 1 : 0,
                            borderBottomColor: '#f1e5dc',
                          }}
                        >
                          <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14 }}>
                            {getLeadStatusLabel(status as LeadStatus)}
                          </Text>
                          <Text style={{ color: solarTheme.colors.text, fontSize: 16, fontWeight: '700' }}>
                            {count}
                          </Text>
                        </View>
                      ))}
                    </SurfaceCard>
                  </>
                ) : null}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {isLoading ? (
        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <LoadingSpinner />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
