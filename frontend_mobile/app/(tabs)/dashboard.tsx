import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDashboardStats } from '../../features/dashboard/useDashboard';
import { useAuthStore } from '../../features/auth/authStore';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { AppTopBar } from '../../shared/ui/AppTopBar';
import { EmptyState } from '../../shared/ui/EmptyState';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { StatusPill } from '../../shared/ui/StatusPill';
import { SurfaceCard } from '../../shared/ui/SurfaceCard';
import { MaterialIcons } from '../../shared/ui/icons';
import { formatCurrency, formatShortDate } from '../../shared/utils/format';
import { getLeadStatusLabel, type LeadStatus } from '../../shared/constants/leadStatus';
import { getInitials, solarTheme } from '../../shared/theme';
import { HeaderActionButton } from '../../shared/ui/HeaderActionButton';
import { StatCard } from '../../shared/ui/StatCard';
import { SkeletonBlock } from '../../shared/ui/SkeletonBlock';

function DashboardSkeleton() {
  return (
    <View className="px-5 pt-2">
      <View className="flex-row gap-3 mb-3">
        <SurfaceCard className="flex-1 p-4">
          <SkeletonBlock className="w-9 h-9 mb-4" />
          <SkeletonBlock className="h-3 w-[76px] mb-3" />
          <SkeletonBlock className="h-6 w-[52px]" />
        </SurfaceCard>
        <SurfaceCard className="flex-1 p-4">
          <SkeletonBlock className="w-9 h-9 mb-4" />
          <SkeletonBlock className="h-3 w-[76px] mb-3" />
          <SkeletonBlock className="h-6 w-[52px]" />
        </SurfaceCard>
      </View>
      <SurfaceCard className="p-5 mb-6">
        <SkeletonBlock className="h-3 w-[110px] mb-4" />
        <SkeletonBlock className="h-8 w-[150px]" />
      </SurfaceCard>
      <SurfaceCard className="p-4">
        <SkeletonBlock className="h-4 w-[130px] mb-5" />
        {[1, 2, 3].map((item) => (
          <View key={item} className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <SkeletonBlock className="w-10 h-10 mr-3" />
              <View>
                <SkeletonBlock className="h-3 w-[110px] mb-2" />
                <SkeletonBlock className="h-3 w-[70px]" />
              </View>
            </View>
            <SkeletonBlock className="h-7 w-[64px]" />
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
    <SafeAreaView className="flex-1 bg-background">
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
                <Text className="text-primary text-[13px] font-bold">Sign out</Text>
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

            <SurfaceCard className="p-5 mb-6">
              <View className="flex-row items-start justify-between mb-4">
                <View className="w-10 h-10 rounded-2xl items-center justify-center bg-surfaceMuted">
                  <MaterialIcons name="currency-rupee" size={20} color={solarTheme.colors.primaryStrong} />
                </View>
                <StatusPill label={`${winRate}% won`} tone="success" />
              </View>

              <Text className="text-textMuted text-sm mb-1.5">Revenue (This Month)</Text>
              <Text className="text-text text-[22px] font-black">
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
                      <SurfaceCard className="flex-row items-center justify-between p-3.5">
                        <View className="flex-row items-center flex-1 pr-3">
                          <View className="w-11 h-11 rounded-full items-center justify-center mr-3 bg-surfaceMuted">
                            <Text className="text-primaryStrong text-sm font-extrabold">
                              {getInitials(lead.name)}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-text text-base font-bold">{lead.name}</Text>
                            <Text className="text-textMuted text-[13px] mt-1">
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
                    <SurfaceCard className="p-4 mt-4">
                      {Object.entries(stats.statusBreakdown).map(([status, count], index, array) => (
                        <View
                          key={status}
                          className={`flex-row items-center justify-between py-2.5 ${
                            index < array.length - 1 ? 'border-b border-border' : ''
                          }`}
                        >
                          <Text className="text-textMuted text-sm">
                            {getLeadStatusLabel(status as LeadStatus)}
                          </Text>
                          <Text className="text-text text-base font-bold">{count}</Text>
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
