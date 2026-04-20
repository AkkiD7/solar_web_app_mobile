import React from 'react';
import { Text, View } from 'react-native';
import { Button } from './Button';
import { MaterialCommunityIcons } from './icons';
import { SurfaceCard } from './SurfaceCard';
import { solarTheme } from '../theme';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'default' | 'danger';
}

export function EmptyState({
  title,
  message,
  icon = 'sun-wireless-outline',
  actionLabel,
  onAction,
  tone = 'default',
}: EmptyStateProps) {
  const isDanger = tone === 'danger';

  return (
    <SurfaceCard
      tone="default"
      shadow="card"
      style={{
        padding: 24,
        backgroundColor: isDanger ? solarTheme.colors.dangerSoft : solarTheme.colors.surface,
        borderColor: isDanger ? '#f2c7c1' : solarTheme.colors.border,
      }}
    >
      <View
        className="w-12 h-12 items-center justify-center rounded-2xl mb-4"
        style={{
          backgroundColor: isDanger ? '#f9d9d4' : solarTheme.colors.primarySoft,
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={isDanger ? solarTheme.colors.danger : solarTheme.colors.primaryStrong}
        />
      </View>

      <Text
        style={{
          color: solarTheme.colors.text,
          fontSize: 20,
          fontWeight: '800',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: solarTheme.colors.textMuted,
          fontSize: 14,
          lineHeight: 22,
        }}
      >
        {message}
      </Text>

      {actionLabel && onAction ? (
        <View className="mt-5">
          <Button title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </SurfaceCard>
  );
}
