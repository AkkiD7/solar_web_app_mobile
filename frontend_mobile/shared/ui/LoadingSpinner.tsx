import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { solarTheme } from '../theme';

export function LoadingSpinner({ size = 'large' }: { size?: 'small' | 'large' }) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={solarTheme.colors.primaryStrong} />
    </View>
  );
}
