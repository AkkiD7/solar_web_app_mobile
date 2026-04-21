import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { solarShadows } from '../theme';

interface SurfaceCardProps extends ViewProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  className?: string;
  tone?: 'default' | 'muted' | 'accent';
  shadow?: 'card' | 'soft' | 'floating' | 'none';
}

const toneStyles = {
  default: 'bg-surface',
  muted: 'bg-surfaceMuted',
  accent: 'bg-primarySoft',
} as const;

export function SurfaceCard({
  children,
  className = '',
  style,
  tone = 'default',
  shadow = 'card',
  ...props
}: SurfaceCardProps) {
  return (
    <View
      {...props}
      className={`rounded-xl border border-border ${toneStyles[tone]} ${className}`}
      style={[
        shadow === 'none' ? null : solarShadows[shadow],
        style,
      ]}
    >
      {children}
    </View>
  );
}
