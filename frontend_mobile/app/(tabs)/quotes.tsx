import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAllQuotes } from '../../features/quotes/useQuotes';
import { QuoteCard } from '../../features/quotes/components/QuoteCard';
import { AppTopBar } from '../../shared/ui/AppTopBar';
import { EmptyState } from '../../shared/ui/EmptyState';
import { SurfaceCard } from '../../shared/ui/SurfaceCard';
import { formatCurrency } from '../../shared/utils/format';
import { solarTheme } from '../../shared/theme';
import { HeaderActionButton } from '../../shared/ui/HeaderActionButton';
import { SkeletonBlock } from '../../shared/ui/SkeletonBlock';

function QuoteSkeleton() {
  return (
    <SurfaceCard className="p-4">
      <SkeletonBlock className="h-5 w-[120px] mb-3" />
      <SkeletonBlock className="h-4 w-[150px] mb-4" />
      <View className="flex-row items-center justify-between">
        <SkeletonBlock className="h-4 w-[90px]" />
        <SkeletonBlock className="h-6 w-[120px]" />
      </View>
    </SurfaceCard>
  );
}

export default function QuotesScreen() {
  const { data: quotes = [], isLoading, isError, refetch, isRefetching } = useAllQuotes();

  const totalQuotedValue = quotes.reduce((sum, quote) => sum + (quote.totalCost || 0), 0);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={isLoading ? [] : quotes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <QuoteCard quote={item} onPress={() => router.push(`/(tabs)/quote/${item._id}`)} />
        )}
        ItemSeparatorComponent={() => <View className="h-3.5" />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListHeaderComponent={
          <View>
            <AppTopBar trailing={<HeaderActionButton icon="bell" onPress={() => undefined} />} />

            <View className="pb-5">
              <Text className="text-text text-[34px] font-extrabold tracking-tight">
                Quotes
              </Text>
              <Text className="text-textMuted text-sm mt-1.5 mb-4">
                {quotes.length} total quotes
              </Text>

              <SurfaceCard tone="accent" className="p-[18px]">
                <Text className="text-textMuted text-[13px] mb-1.5">
                  Portfolio Value
                </Text>
                <Text className="text-primaryStrong text-[26px] font-black">
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
