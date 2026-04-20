import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { useQuote } from '../../../features/quotes/useQuotes';
import { quotesApi } from '../../../features/quotes/quotesApi';
import { usePreferences } from '../../../features/settings/useSettings';
import { useAuthStore } from '../../../features/auth/authStore';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';
import { Button } from '../../../shared/ui/Button';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { SolarBrand } from '../../../shared/ui/SolarBrand';
import { StatusPill } from '../../../shared/ui/StatusPill';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { Feather, MaterialIcons } from '../../../shared/ui/icons';
import { formatCurrency, formatDate } from '../../../shared/utils/format';
import { getQuoteLead } from '../../../features/quotes/types';
import { getInitials, solarTheme } from '../../../shared/theme';

function DetailRow({
  icon,
  label,
  sublabel,
  value,
}: {
  icon: React.ComponentProps<typeof Feather>['name'] | React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  sublabel?: string;
  value: string;
}) {
  const IconComponent = icon === 'grid-view' ? MaterialIcons : Feather;

  return (
    <View
      className="flex-row items-center justify-between"
      style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1e5dc' }}
    >
      <View className="flex-row items-center flex-1 pr-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: solarTheme.colors.surfaceMuted }}
        >
          <IconComponent
            name={icon as any}
            size={18}
            color={solarTheme.colors.primaryStrong}
          />
        </View>
        <View className="flex-1">
          <Text style={{ color: solarTheme.colors.text, fontSize: 15, fontWeight: '600' }}>
            {label}
          </Text>
          {sublabel ? (
            <Text style={{ color: solarTheme.colors.textMuted, fontSize: 12, marginTop: 2 }}>
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>

      <Text style={{ color: solarTheme.colors.text, fontSize: 18, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: quote, isLoading, isError, refetch } = useQuote(id ?? '');
  const { data: preferences } = usePreferences();
  const token = useAuthStore((state) => state.token);
  const [isOpeningPdf, setIsOpeningPdf] = useState(false);
  const [isSharingPdf, setIsSharingPdf] = useState(false);

  const lead = quote ? getQuoteLead(quote) : null;
  const pdfUrl = quote && token ? quotesApi.getPdfUrl(quote._id, token) : null;
  const currency = preferences?.currency ?? 'INR';
  const dateFormat = preferences?.dateFormat ?? 'DD/MM/YYYY';

  const handleViewPdf = async () => {
    if (!pdfUrl) {
      Alert.alert('PDF unavailable', 'Your session has expired. Please sign in again.');
      return;
    }

    try {
      setIsOpeningPdf(true);
      await WebBrowser.openBrowserAsync(pdfUrl);
    } catch {
      Alert.alert('Could not open PDF', 'Please try again.');
    } finally {
      setIsOpeningPdf(false);
    }
  };

  const handleSharePdf = async () => {
    if (!pdfUrl || !quote) {
      Alert.alert('PDF unavailable', 'Your session has expired. Please sign in again.');
      return;
    }

    try {
      setIsSharingPdf(true);

      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        Alert.alert('Sharing unavailable', 'This device does not support file sharing.');
        return;
      }

      const targetPath = `${FileSystem.cacheDirectory}quote-${quote.quoteNumber}.pdf`;
      const download = await FileSystem.downloadAsync(pdfUrl, targetPath);

      await Sharing.shareAsync(download.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share quote PDF',
        UTI: 'com.adobe.pdf',
      });
    } catch {
      Alert.alert('Could not share PDF', 'Please try again.');
    } finally {
      setIsSharingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError || !quote) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
        <View className="px-5 pt-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="self-start w-10 h-10 rounded-full items-center justify-center mb-4"
            style={{
              backgroundColor: solarTheme.colors.surface,
              borderWidth: 1,
              borderColor: solarTheme.colors.border,
            }}
          >
            <Feather name="arrow-left" size={18} color={solarTheme.colors.text} />
          </TouchableOpacity>
          <EmptyState
            tone="danger"
            icon="file-alert-outline"
            title="Quote unavailable"
            message="The quote may have been removed or the request failed."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1 pr-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{
                backgroundColor: solarTheme.colors.surface,
                borderWidth: 1,
                borderColor: solarTheme.colors.border,
              }}
            >
              <Feather name="arrow-left" size={18} color={solarTheme.colors.text} />
            </TouchableOpacity>
            <SolarBrand size="compact" />
          </View>
          <TouchableOpacity
            onPress={() => undefined}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{
              backgroundColor: solarTheme.colors.surface,
              borderWidth: 1,
              borderColor: solarTheme.colors.border,
            }}
          >
            <Feather name="bell" size={17} color={solarTheme.colors.primaryStrong} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-start justify-between mb-5">
          <View className="flex-1 pr-3">
            <Text
              style={{
                color: solarTheme.colors.text,
                fontSize: 34,
                fontWeight: '800',
                letterSpacing: -0.8,
              }}
            >
              QT-{String(quote.quoteNumber).padStart(4, '0')}
            </Text>
            <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, marginTop: 6 }}>
              Generated: {formatDate(quote.createdAt, dateFormat)}
            </Text>
          </View>
          <StatusPill label="Generated" tone="info" />
        </View>

        <SurfaceCard style={{ padding: 18, marginBottom: 18 }}>
          <View className="flex-row items-center">
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
                {getInitials(lead?.name)}
              </Text>
            </View>
            <View className="flex-1">
              <Text style={{ color: solarTheme.colors.text, fontSize: 22, fontWeight: '800' }}>
                {lead?.name ?? 'Lead'}
              </Text>
              {lead?.location ? (
                <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, marginTop: 4 }}>
                  {lead.location}
                </Text>
              ) : null}
              {lead?.phone ? (
                <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, marginTop: 4 }}>
                  {lead.phone}
                </Text>
              ) : null}
            </View>
          </View>
        </SurfaceCard>

        <Text
          style={{
            color: solarTheme.colors.textMuted,
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 1.1,
            textTransform: 'uppercase',
            marginBottom: 10,
            marginLeft: 4,
          }}
        >
          System Details
        </Text>

        <SurfaceCard style={{ paddingHorizontal: 18, marginBottom: 18 }}>
          <DetailRow
            icon="sun"
            label="System Size"
            sublabel="Configured system"
            value={`${quote.systemSizeKW} kW`}
          />
          <DetailRow
            icon="grid-view"
            label="Panel Cost"
            sublabel={`Per kW: ${formatCurrency(quote.panelCostPerKW, currency)}`}
            value={formatCurrency(quote.panelCost, currency)}
          />
          <DetailRow
            icon="zap"
            label="Inverter Cost"
            sublabel="Core equipment"
            value={formatCurrency(quote.inverterCost, currency)}
          />
          <DetailRow
            icon="tool"
            label="Installation"
            sublabel="Labor & balance of system"
            value={formatCurrency(quote.installationCost, currency)}
          />

          <View className="pt-5 pb-5">
            <View className="flex-row items-end justify-between">
              <View className="flex-1 pr-3">
                <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14 }}>
                  Total Amount
                </Text>
                <Text style={{ color: solarTheme.colors.textSoft, fontSize: 12, marginTop: 4 }}>
                  Valid till {formatDate(quote.validTill, dateFormat)}
                </Text>
              </View>
              <Text
                style={{
                  color: solarTheme.colors.primaryStrong,
                  fontSize: 34,
                  fontWeight: '900',
                }}
              >
                {formatCurrency(quote.totalCost, currency)}
              </Text>
            </View>
          </View>
        </SurfaceCard>

        {quote.notes ? (
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
            <Text style={{ color: solarTheme.colors.text, fontSize: 14, lineHeight: 22 }}>
              {quote.notes}
            </Text>
          </SurfaceCard>
        ) : null}

        <View className="gap-3">
          <Button
            title="Open PDF"
            loading={isOpeningPdf}
            onPress={handleViewPdf}
            icon={<Feather name="external-link" size={18} color={solarTheme.colors.white} />}
            iconPosition="left"
          />
          <Button
            title={isSharingPdf ? 'Sharing...' : 'Share PDF'}
            variant="outline"
            disabled={isSharingPdf}
            onPress={handleSharePdf}
            icon={<Feather name="share-2" size={18} color={solarTheme.colors.primaryStrong} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
