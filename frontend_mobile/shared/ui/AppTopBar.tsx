import React from 'react';
import { Image, Text, View } from 'react-native';
import { SolarBrand } from './SolarBrand';
import { solarTheme } from '../theme';

interface AppTopBarProps {
  subtitle?: string;
  logoUrl?: string | null;
  trailing?: React.ReactNode;
}

export function AppTopBar({ subtitle, logoUrl, trailing }: AppTopBarProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
      <View className="flex-row items-center flex-1 pr-3">
        {logoUrl ? (
          <Image
            source={{ uri: logoUrl }}
            className="w-9 h-9 rounded-2xl mr-3"
            resizeMode="cover"
          />
        ) : null}
        <View className="flex-1">
          <SolarBrand size="compact" />
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={{
                color: solarTheme.colors.textMuted,
                fontSize: 14,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {trailing}
    </View>
  );
}
