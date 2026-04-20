import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { formatCurrency, formatDate } from '../../../shared/utils/format';
import { getQuoteLead, type Quote } from '../types';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { StatusPill } from '../../../shared/ui/StatusPill';
import { Feather } from '../../../shared/ui/icons';
import { solarTheme } from '../../../shared/theme';

interface QuoteCardProps {
  quote: Quote;
  onPress?: () => void;
  showLeadName?: boolean;
}

export function QuoteCard({ quote, onPress, showLeadName = true }: QuoteCardProps) {
  const lead = getQuoteLead(quote);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      <SurfaceCard style={{ padding: 18 }}>
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 pr-3">
            <Text
              style={{
                color: solarTheme.colors.text,
                fontSize: 20,
                fontWeight: '800',
              }}
            >
              QT-{String(quote.quoteNumber).padStart(4, '0')}
            </Text>
            {showLeadName && lead?.name ? (
              <Text
                style={{
                  color: solarTheme.colors.textMuted,
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                {lead.name}
              </Text>
            ) : null}
          </View>
          <StatusPill label={`${quote.systemSizeKW} kW`} tone="primary" />
        </View>

        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Feather name="calendar" size={15} color={solarTheme.colors.textSoft} />
            <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, marginLeft: 8 }}>
              Valid till
            </Text>
          </View>
          <Text style={{ color: solarTheme.colors.text, fontSize: 14, fontWeight: '600' }}>
            {formatDate(quote.validTill)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="file-text" size={15} color={solarTheme.colors.textSoft} />
            <Text style={{ color: solarTheme.colors.textMuted, fontSize: 14, marginLeft: 8 }}>
              Total
            </Text>
          </View>
          <Text style={{ color: solarTheme.colors.primaryStrong, fontSize: 20, fontWeight: '800' }}>
            {formatCurrency(quote.totalCost)}
          </Text>
        </View>
      </SurfaceCard>
    </TouchableOpacity>
  );
}
