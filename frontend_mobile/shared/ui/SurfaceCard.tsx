import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { solarShadows, solarTheme } from '../theme';

interface SurfaceCardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  tone?: 'default' | 'muted' | 'accent';
  shadow?: 'card' | 'soft' | 'floating' | 'none';
}

const toneStyles = {
  default: {
    backgroundColor: solarTheme.colors.surface,
  },
  muted: {
    backgroundColor: solarTheme.colors.surfaceMuted,
  },
  accent: {
    backgroundColor: solarTheme.colors.primarySoft,
  },
} as const;

export function SurfaceCard({
  children,
  style,
  tone = 'default',
  shadow = 'card',
  ...props
}: SurfaceCardProps) {
  return (
    <View
      {...props}
      style={[
        {
          borderRadius: solarTheme.radius.xl,
          borderWidth: 1,
          borderColor: solarTheme.colors.border,
        },
        toneStyles[tone],
        shadow === 'none' ? null : solarShadows[shadow],
        style,
      ]}
    >
      {children}
    </View>
  );
}
