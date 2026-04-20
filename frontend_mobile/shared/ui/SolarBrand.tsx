import React from 'react';
import { Text, View } from 'react-native';
import { Feather } from './icons';
import { solarShadows, solarTheme } from '../theme';

interface SolarBrandProps {
  size?: 'compact' | 'hero';
  subtitle?: string;
  centered?: boolean;
}

export function SolarBrand({
  size = 'compact',
  subtitle,
  centered = false,
}: SolarBrandProps) {
  const isHero = size === 'hero';
  const iconSize = isHero ? 22 : 16;
  const badgeSize = isHero ? 64 : 38;

  return (
    <View className={centered ? 'items-center' : 'flex-row items-center'}>
      <View
        className={centered ? 'mb-5 items-center justify-center' : 'mr-3 items-center justify-center'}
        style={[
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: isHero ? 22 : 14,
            backgroundColor: solarTheme.colors.primarySoft,
            borderWidth: 1,
            borderColor: '#f2d8c6',
          },
          solarShadows.soft,
        ]}
      >
        <Feather name="sun" size={iconSize} color={solarTheme.colors.primaryStrong} />
      </View>

      <View className={centered ? 'items-center' : undefined}>
        <Text
          style={{
            color: solarTheme.colors.text,
            fontSize: isHero ? 22 : 20,
            fontWeight: '900',
            letterSpacing: -0.8,
          }}
        >
          <Text style={{ color: solarTheme.colors.primaryStrong }}>Solar</Text>CRM
        </Text>
        {subtitle ? (
          <Text
            style={{
              color: solarTheme.colors.textMuted,
              fontSize: isHero ? 15 : 13,
              lineHeight: isHero ? 22 : 18,
              marginTop: isHero ? 8 : 2,
              textAlign: centered ? 'center' : 'left',
              maxWidth: isHero ? 260 : undefined,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
