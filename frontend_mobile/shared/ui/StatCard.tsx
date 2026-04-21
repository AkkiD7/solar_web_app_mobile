import React from 'react';
import { Text, View } from 'react-native';
import { SurfaceCard } from './SurfaceCard';
import { MaterialIcons } from './icons';
import { solarTheme } from '../theme';

export function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string | number;
}) {
  return (
    <SurfaceCard className="flex-1 p-4">
      <View className="w-9 h-9 rounded-2xl items-center justify-center mb-4 bg-surfaceMuted">
        <MaterialIcons name={icon} size={18} color={solarTheme.colors.primaryStrong} />
      </View>
      <Text className="text-textMuted text-[13px] mb-1.5">{label}</Text>
      <Text className="text-text text-lg font-extrabold">{value}</Text>
    </SurfaceCard>
  );
}
