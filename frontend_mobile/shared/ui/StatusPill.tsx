import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import type { LeadStatus } from '../constants/leadStatus';
import { getLeadStatusTheme, solarTheme } from '../theme';

interface StatusPillProps {
  label: string;
  status?: LeadStatus;
  tone?: 'neutral' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  compact?: boolean;
  style?: ViewStyle | ViewStyle[];
}

const toneTheme = {
  neutral: {
    background: solarTheme.colors.surfaceMuted,
    text: solarTheme.colors.textMuted,
  },
  primary: {
    background: solarTheme.colors.primarySoft,
    text: solarTheme.colors.primaryStrong,
  },
  success: {
    background: solarTheme.colors.successSoft,
    text: solarTheme.colors.success,
  },
  info: {
    background: solarTheme.colors.infoSoft,
    text: solarTheme.colors.info,
  },
  warning: {
    background: solarTheme.colors.warningSoft,
    text: solarTheme.colors.warning,
  },
  danger: {
    background: solarTheme.colors.dangerSoft,
    text: solarTheme.colors.danger,
  },
} as const;

export function StatusPill({
  label,
  status,
  tone = 'neutral',
  compact = false,
  style,
}: StatusPillProps) {
  const palette = status ? getLeadStatusTheme(status) : toneTheme[tone];

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          borderRadius: solarTheme.radius.pill,
          paddingHorizontal: compact ? 10 : 12,
          paddingVertical: compact ? 5 : 7,
          backgroundColor: palette.background,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: palette.text,
          fontSize: compact ? 10 : 11,
          fontWeight: '800',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
