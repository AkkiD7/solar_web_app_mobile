import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAllQuotes } from '../../features/quotes/useQuotes';
import { QuoteCard } from '../../features/quotes/components/QuoteCard';
import { AppTopBar } from '../../shared/ui/AppTopBar';
import { EmptyState } from '../../shared/ui/EmptyState';
import { SurfaceCard } from '../../shared/ui/SurfaceCard';
import { Feather } from '../../shared/ui/icons';
import { formatCurrency } from '../../shared/utils/format';
import { solarTheme } from '../../shared/theme';

function QuoteSkeleton() {
  return (
    <SurfaceCard style={{ padding: 18 }}>
      <View className="h-5 rounded-full mb-3" style={{ width: 120, backgroundColor: '#efe4dd' }} />
      <View className="h-4 rounded-full mb-4" style={{ width: 150, backgroundColor: '#f4ebe5' }} />
      <View className="flex-row items-center justify-between">
        <View className="h-4 rounded-full" style={{ width: 90, backgroundColor: '#f4ebe5' }} />
        <View className="h-6 rounded-full" style={{ width: 120, backgroundColor: '#efe4dd' }} />
      </View>
    </SurfaceCard>
  );
}

export default function QuotesScreen() {
  const { data: quotes = [], isLoading, isError, refetch, isRefetching } = useAllQuotes();

  const totalQuotedValue = quotes.reduce((sum, quote) => sum + (quote.totalCost || 0), 0);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: solarTheme.colors.background }}>
      <FlatList
        data={isLoading ? [] : quotes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <QuoteCard quote={item} onPress={() => router.push(`/(tabs)/quote/${item._id}`)} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListHeaderComponent={
          <View>
            <AppTopBar
              trailing={
                <TouchableOpacity
                  onPress={() => undefined}
                  className="w-10 h-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: solarTheme.colors.surface,
                    borderWidth: 1,
                    borderColor: solarTheme.colors.border,
                  }}
                >
                  <Feather name="bell" size={17} color={solarTheme.colors.primaryStrong} />
                </TouchableOpacity>
              }
            />

            <View className="pb-5">
              <Text
                style={{
                  color: solarTheme.colors.text,
                  fontSize: 34,
                  fontWeight: '800',
                  letterSpacing: -0.8,
                }}
              >
                Quotes
              </Text>
              <Text
                style={{
                  color: solarTheme.colors.textMuted,
                  fontSize: 14,
                  marginTop: 6,
                  marginBottom: 16,
                }}
              >
                {quotes.length} total quotes
              </Text>

              <SurfaceCard tone="accent" style={{ padding: 18 }}>
                <Text style={{ color: solarTheme.colors.textMuted, fontSize: 13, marginBottom: 6 }}>
                  Portfolio Value
                </Text>
                <Text
                  style={{
                    color: solarTheme.colors.primaryStrong,
                    fontSize: 26,
                    fontWeight: '900',
                  }}
                >
                  {formatCurrency(totalQuotedValue)}
                </Text>
              </SurfaceCard>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-3">
              <QuoteSkeleton />
              <QuoteSkeleton />
              <QuoteSkeleton />
            </View>
          ) : isError ? (
            <EmptyState
              tone="danger"
              icon="cloud-alert-outline"
              title="Quotes unavailable"
              message="We could not load the latest quotes. Pull to refresh or retry below."
              actionLabel="Retry"
              onAction={() => refetch()}
            />
          ) : (
            <EmptyState
              title="No quotes yet"
              message="Create a quote from any lead detail screen and it will appear here."
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
    </SafeAreaView>
  );
}
