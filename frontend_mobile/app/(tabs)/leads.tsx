import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCreateLead, useLeads } from '../../features/leads/useLeads';
import { LeadForm } from '../../features/leads/components/LeadForm';
import type { Lead, LeadStatus } from '../../features/leads/types';
import { AppTopBar } from '../../shared/ui/AppTopBar';
import { EmptyState } from '../../shared/ui/EmptyState';
import { SearchField } from '../../shared/ui/SearchField';
import { StatusPill } from '../../shared/ui/StatusPill';
import { SurfaceCard } from '../../shared/ui/SurfaceCard';
import { ScreenHeader } from '../../shared/ui/ScreenHeader';
import { Feather, MaterialIcons } from '../../shared/ui/icons';
import { formatFollowUpLabel } from '../../shared/utils/format';
import { LEAD_STATUS_OPTIONS, getLeadStatusLabel } from '../../shared/constants/leadStatus';
import { solarTheme } from '../../shared/theme';
import { FilterChip } from '../../shared/ui/FilterChip';
import { HeaderActionButton } from '../../shared/ui/HeaderActionButton';
import { SkeletonBlock } from '../../shared/ui/SkeletonBlock';

type LeadFilter = 'ALL' | LeadStatus;

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/lead/${lead._id}`)}
      activeOpacity={0.88}
    >
      <SurfaceCard className="overflow-hidden p-0">
        <View className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

        <View className="p-[18px]">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 pr-3">
              <Text className="text-text text-base font-extrabold">{lead.name}</Text>
              <View className="flex-row items-center mt-1">
                <MaterialIcons
                  name="business"
                  size={15}
                  color={solarTheme.colors.textSoft}
                />
                <Text className="text-textMuted text-[13px] ml-1.5">
                  {lead.location || lead.email || 'Solar opportunity'}
                </Text>
              </View>
            </View>
            <StatusPill label={getLeadStatusLabel(lead.status)} status={lead.status} compact />
          </View>

          <View className="flex-row items-center justify-between border-t border-border pt-3.5">
            <View className="flex-row items-center flex-1 pr-2">
              <Feather name="phone" size={15} color={solarTheme.colors.primaryStrong} />
              <Text className="text-textMuted text-[13px] ml-2 flex-shrink">
                {lead.phone}
              </Text>
            </View>

            <View className="flex-row items-center rounded-xl px-3 py-2 bg-surfaceMuted">
              <Feather name="calendar" size={14} color={solarTheme.colors.textMuted} />
              <Text className="text-textMuted text-xs ml-2">
                Follow up: {formatFollowUpLabel(lead.followUpDate ?? lead.createdAt)}
              </Text>
            </View>
          </View>

          {lead.systemSizeKW != null ? (
            <Text className="text-textSoft text-xs mt-3">
              System size: {lead.systemSizeKW} kW
            </Text>
          ) : null}
        </View>
      </SurfaceCard>
    </TouchableOpacity>
  );
}

function LeadSkeleton() {
  return (
    <SurfaceCard className="p-4">
      <SkeletonBlock className="h-5 w-[140px] mb-3" />
      <SkeletonBlock className="h-4 w-[170px] mb-5" />
      <View className="flex-row items-center justify-between">
        <SkeletonBlock className="h-4 w-[110px]" />
        <SkeletonBlock className="h-8 w-[110px]" />
      </View>
    </SurfaceCard>
  );
}

export default function LeadsScreen() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadFilter>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const { data: leads = [], isLoading, isError, refetch, isRefetching } = useLeads();
  const createLead = useCreateLead();

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesQuery =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.location?.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const closeModal = () => {
    setShowModal(false);
    setFormKey((value) => value + 1);
  };

  const handleCreateLead = async (data: Parameters<typeof createLead.mutateAsync>[0]) => {
    try {
      await createLead.mutateAsync(data);
      closeModal();
    } catch (error: any) {
      Alert.alert('Could not create lead', error?.response?.data?.message ?? 'Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={isLoading ? [] : filteredLeads}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <LeadCard lead={item} />}
        ItemSeparatorComponent={() => <View className="h-3.5" />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 126 }}
        ListHeaderComponent={
          <View>
            <AppTopBar trailing={<HeaderActionButton icon="bell" onPress={() => undefined} />} />

            <View className="pb-4">
              <Text className="text-text text-[34px] font-extrabold tracking-tight">
                Leads Directory
              </Text>
              <Text className="text-textMuted text-sm mt-1.5 mb-4">
                {leads.length} total opportunities
              </Text>

              <SearchField
                value={search}
                onChangeText={setSearch}
                placeholder="Search by name, phone or company..."
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 14, paddingBottom: 6 }}
              >
                <FilterChip
                  label="All"
                  active={statusFilter === 'ALL'}
                  onPress={() => setStatusFilter('ALL')}
                />
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={option.value}
                    active={statusFilter === option.value}
                    onPress={() => setStatusFilter(option.value)}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-3">
              <LeadSkeleton />
              <LeadSkeleton />
              <LeadSkeleton />
            </View>
          ) : isError ? (
            <EmptyState
              tone="danger"
              icon="cloud-alert-outline"
              title="Leads unavailable"
              message="We could not load your leads right now. Pull to refresh or retry below."
              actionLabel="Retry"
              onAction={() => refetch()}
            />
          ) : (
            <EmptyState
              title={search || statusFilter !== 'ALL' ? 'No matching leads' : 'No leads yet'}
              message={
                search || statusFilter !== 'ALL'
                  ? 'Try a different search term or clear your active filters.'
                  : 'Add your first lead to start tracking opportunities and follow-ups.'
              }
              actionLabel={search || statusFilter !== 'ALL' ? 'Clear Filters' : 'Create Lead'}
              onAction={() => {
                if (search || statusFilter !== 'ALL') {
                  setSearch('');
                  setStatusFilter('ALL');
                  return;
                }

                setShowModal(true);
              }}
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={solarTheme.colors.primaryStrong}
            colors={[solarTheme.colors.primaryStrong]}
          />
        }
      />

      <TouchableOpacity
        onPress={() => setShowModal(true)}
        className="absolute w-14 h-14 rounded-full items-center justify-center bg-primaryStrong right-6 bottom-[112px]"
        style={{
          shadowColor: '#85471c',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.18,
          shadowRadius: 20,
          elevation: 7,
        }}
      >
        <Feather name="plus" size={24} color={solarTheme.colors.white} />
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          className="flex-1 bg-background"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView className="flex-1 bg-background">
            <ScreenHeader
              title="New Lead"
              subtitle="Capture the full lead details up front."
              onBack={closeModal}
            />

            <ScrollView
              className="flex-1 px-5"
              contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <LeadForm
                key={formKey}
                submitLabel="Create Lead"
                loading={createLead.isPending}
                onSubmit={handleCreateLead}
              />
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
