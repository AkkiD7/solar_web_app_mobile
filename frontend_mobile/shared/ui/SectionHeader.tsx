import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { solarTheme } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-end justify-between">
      <View className="flex-1 pr-3">
        <Text
          style={{
            color: solarTheme.colors.text,
            fontSize: 18,
            fontWeight: '800',
            letterSpacing: -0.4,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              color: solarTheme.colors.textMuted,
              fontSize: 13,
              marginTop: 4,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction}>
          <Text
            style={{
              color: solarTheme.colors.primary,
              fontSize: 14,
              fontWeight: '700',
            }}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
