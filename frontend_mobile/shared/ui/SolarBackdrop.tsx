import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { solarTheme } from '../theme';

interface SolarBackdropProps {
  style?: ViewStyle | ViewStyle[];
  size?: number;
}

const lineAngles = ['0deg', '90deg', '45deg', '-45deg'] as const;

export function SolarBackdrop({ style, size = 360 }: SolarBackdropProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.85,
        },
        style,
      ]}
    >
      {[1, 0.72, 0.46].map((scale) => {
        const dimension = size * scale;
        return (
          <View
            key={scale}
            style={{
              position: 'absolute',
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              borderWidth: 1,
              borderColor: solarTheme.colors.line,
            }}
          />
        );
      })}

      {lineAngles.map((rotate) => (
        <View
          key={rotate}
          style={{
            position: 'absolute',
            width: 1,
            height: size,
            backgroundColor: solarTheme.colors.line,
            transform: [{ rotate }],
          }}
        />
      ))}
    </View>
  );
}
