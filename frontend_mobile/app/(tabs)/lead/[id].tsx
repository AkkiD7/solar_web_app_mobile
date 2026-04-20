import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useDeleteLead, useLead, useUpdateLead } from '../../../features/leads/useLeads';
import { useCreateQuote, useQuotesByLead } from '../../../features/quotes/useQuotes';
import { usePricingConfig } from '../../../features/settings/useSettings';
import { LeadForm } from '../../../features/leads/components/LeadForm';
import { QuoteForm } from '../../../features/quotes/components/QuoteForm';
import { QuoteCard } from '../../../features/quotes/components/QuoteCard';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';
import { Button } from '../../../shared/ui/Button';
import { ScreenHeader } from '../../../shared/ui/ScreenHeader';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { StatusPill } from '../../../shared/ui/StatusPill';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { Feather } from '../../../shared/ui/icons';
import { formatFollowUpLabel, formatLongDate } from '../../../shared/utils/format';
import {
  LEAD_STATUS_OPTIONS,
  getLeadStatusLabel,
  type LeadStatus,
} from '../../../shared/constants/leadStatus';
import {
  getInitials,
  getLeadStatusTheme,
  solarTheme,
} from '../../../shared/theme';

function HeroRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value?: string | number | null;
}) {
  if (value == null || value === '') {
    return null;
  }

  return (
    <View className="flex-row items-center mb-3 last:mb-0">
      <Feather name={icon} size={15} color={solarTheme.colors.textSoft} />
      <Text
        style={{
          color: solarTheme.colors.textMuted,
          fontSize: 13,
          marginLeft: 8,
          marginRight: 6,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: solarTheme.colors.text,
          fontSize: 13,
          fontWeight: '600',
          flexShrink: 1,
        }}
      >
        {String(value)}
      </Text>
    </View>
  );
}

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const { data: lead, isLoading, isError, refetch } = useLead(id ?? '');
  const {
    data: quotes = [],
    isError: quotesError,
    isLoading: areQuotesLoading,
  } = useQuotesByLead(id ?? '');
  const { data: pricingConfig } = usePricingConfig();
  const updateLead = useUpdateLead(id ?? '');
  const deleteLead = useDeleteLead();
  const createQuote = useCreateQuote();

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead || status === lead.status) {
      return;
    }

    try {
      await updateLead.mutateAsync({ status });
    } catch (error: any) {
      Alert.alert('Could not update status', error?.response?.data?.message ?? 'Please try again.');
    }
  };

  const handleEditLead = async (values: Parameters<typeof updateLead.mutateAsync>[0]) => {
    try {
      await updateLead.mutateAsync(values);
      setShowEditModal(false);
    } catch (error: any) {
      Alert.alert('Could not save lead', error?.response?.data?.message ?? 'Please try again.');
    }
  };

  const handleCreateQuote = async (values: Parameters<typeof createQuote.mutateAsync>[0]) => {
    try {
      await createQuote.mutateAsync(values);
      setShowQuoteModal(false);
    } catch (error: any) {
      Alert.alert('Could not create quote', error?.response?.data?.message ?? 'Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete lead', 'This lead will be removed from your active pipeline.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteLead.mutateAsync(id ?? '');
            router.replace('/(tabs)/leads');
          } catch (error: any) {
            Alert.alert('Could not delete lead', error?.response?.data?.message ?? 'Please try again.');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError || !lead) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
        <ScreenHeader title="Lead" subtitle="We could not load this lead." onBack={() => router.back()} />
        <View className="px-5 pt-3">
          <EmptyState
            tone="danger"
            icon="account-alert-outline"
            title="Lead unavailable"
            message="The lead might have been deleted or the server request failed."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const statusTheme = getLeadStatusTheme(lead.status);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
      <ScreenHeader
        title="Lead"
        subtitle={`Added ${formatLongDate(lead.createdAt)}`}
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            onPress={() => setShowEditModal(true)}
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
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <SurfaceCard style={{ padding: 18, marginBottom: 18 }}>
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-row items-center flex-1 pr-3">
              <View
                className="w-14 h-14 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: solarTheme.colors.surfaceMuted }}
              >
                <Text
                  style={{
                    color: solarTheme.colors.primaryStrong,
                    fontSize: 18,
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
                    fontSize: 24,
                    fontWeight: '800',
                  }}
                >
                  {lead.name}
                </Text>
                <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, marginTop: 4 }}>
                  Solar opportunity
                </Text>
              </View>
            </View>
            <StatusPill label={getLeadStatusLabel(lead.status)} status={lead.status} />
          </View>

          <HeroRow icon="phone" label="Phone" value={lead.phone} />
          <HeroRow icon="mail" label="Email" value={lead.email} />
          <HeroRow icon="map-pin" label="Location" value={lead.location} />
          <HeroRow
            icon="sun"
            label="System"
            value={lead.systemSizeKW != null ? `${lead.systemSizeKW} kW` : null}
          />
          <HeroRow
            icon="calendar"
            label="Follow up"
            value={formatFollowUpLabel(lead.followUpDate ?? lead.createdAt)}
          />
        </SurfaceCard>

        {lead.notes ? (
          <SurfaceCard style={{ padding: 18, marginBottom: 18 }}>
            <Text
              style={{
                color: solarTheme.colors.textMuted,
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 1.1,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Notes
            </Text>
            <Text
              style={{
                color: solarTheme.colors.text,
                fontSize: 14,
                lineHeight: 22,
              }}
            >
              {lead.notes}
            </Text>
          </SurfaceCard>
        ) : null}

        <SectionHeader title="Update Status" />
        <View className="flex-row flex-wrap gap-2 mt-4 mb-6">
          {LEAD_STATUS_OPTIONS.map((statusOption) => {
            const active = lead.status === statusOption.value;
            const chipTheme = getLeadStatusTheme(statusOption.value);

            return (
              <TouchableOpacity
                key={statusOption.value}
                onPress={() => handleStatusChange(statusOption.value)}
                disabled={updateLead.isPending}
                className="px-4 py-3 rounded-2xl"
                style={{
                  borderWidth: 1,
                  borderColor: active ? chipTheme.accent : solarTheme.colors.border,
                  backgroundColor: active ? chipTheme.background : solarTheme.colors.surface,
                }}
              >
                <Text
                  style={{
                    color: active ? chipTheme.text : solarTheme.colors.textMuted,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  {statusOption.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mb-4">
          <SectionHeader title="Quotes" subtitle={`${quotes.length} linked quote${quotes.length === 1 ? '' : 's'}`} />
        </View>

        <TouchableOpacity
          onPress={() => setShowQuoteModal(true)}
          className="self-start mb-4 px-4 py-3 rounded-2xl"
          style={{
            backgroundColor: solarTheme.colors.primaryStrong,
          }}
        >
          <Text
            style={{
              color: solarTheme.colors.white,
              fontSize: 14,
              fontWeight: '700',
            }}
          >
            New Quote
          </Text>
        </TouchableOpacity>

        {areQuotesLoading ? (
          <SurfaceCard style={{ padding: 18, marginBottom: 18 }}>
            <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14 }}>Loading quotes...</Text>
          </SurfaceCard>
        ) : quotesError ? (
          <EmptyState
            tone="danger"
            icon="file-alert-outline"
            title="Quotes unavailable"
            message="We could not load quotes linked to this lead."
          />
        ) : quotes.length === 0 ? (
          <EmptyState
            title="No quotes yet"
            message="Create the first quote from here and it will appear in the Quotes tab too."
          />
        ) : (
          <View className="gap-3 mb-6">
            {quotes.map((quote) => (
              <QuoteCard
                key={quote._id}
                quote={quote}
                showLeadName={false}
                onPress={() => router.push(`/(tabs)/quote/${quote._id}`)}
              />
            ))}
          </View>
        )}

        <Button
          title="Delete Lead"
          variant="danger"
          loading={deleteLead.isPending}
          onPress={handleDelete}
        />
      </ScrollView>

      <Modal visible={showEditModal} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          className="flex-1"
          style={{ backgroundColor: solarTheme.colors.background }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
            <ScreenHeader
              title="Edit Lead"
              subtitle="Update the lead details."
              onBack={() => setShowEditModal(false)}
            />
            <ScrollView
              className="flex-1 px-5"
              contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <LeadForm
                defaultValues={lead}
                submitLabel="Save Changes"
                loading={updateLead.isPending}
                onSubmit={handleEditLead}
              />
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showQuoteModal} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          className="flex-1"
          style={{ backgroundColor: solarTheme.colors.background }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
            <ScreenHeader
              title="Create Quote"
              subtitle={`For ${lead.name}`}
              onBack={() => setShowQuoteModal(false)}
            />
            <ScrollView
              className="flex-1 px-5"
              contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <QuoteForm
                leadId={lead._id}
                loading={createQuote.isPending}
                defaults={{
                  systemSizeKW: lead.systemSizeKW,
                  panelCostPerKW: pricingConfig?.defaultPanelCostPerKW ?? 0,
                  inverterCost: pricingConfig?.defaultInverterCost ?? 0,
                  installationCost: pricingConfig?.defaultInstallationCost ?? 0,
                }}
                onSubmit={handleCreateQuote}
              />
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
