import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from './icons';
import { solarTheme } from '../theme';

export function HeaderActionButton({
  icon,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-10 h-10 items-center justify-center rounded-full bg-surface border border-border"
    >
      <Feather name={icon} size={17} color={solarTheme.colors.primaryStrong} />
    </TouchableOpacity>
  );
}
