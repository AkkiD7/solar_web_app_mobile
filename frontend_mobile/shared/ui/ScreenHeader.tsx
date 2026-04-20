import React from 'react';
import { View, Text, TouchableOpacity, type ViewStyle } from 'react-native';
import { Feather } from './icons';
import { solarTheme } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, onBack, rightAction, style }: ScreenHeaderProps) {
  return (
    <View
      className="flex-row items-start justify-between px-5 pt-3 pb-3"
      style={[
        {
          backgroundColor: solarTheme.colors.background,
        },
        style,
      ]}
    >
      <View className="flex-1 pr-3">
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            className="self-start mb-3 w-10 h-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: solarTheme.colors.surface,
              borderWidth: 1,
              borderColor: solarTheme.colors.border,
            }}
          >
            <Feather name="arrow-left" size={18} color={solarTheme.colors.text} />
          </TouchableOpacity>
        ) : null}
        <Text
          style={{
            color: solarTheme.colors.text,
            fontSize: 30,
            fontWeight: '800',
            letterSpacing: -0.7,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              color: solarTheme.colors.textMuted,
              fontSize: 14,
              marginTop: 6,
              lineHeight: 20,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightAction ? <View className="pt-1">{rightAction}</View> : null}
    </View>
  );
}
