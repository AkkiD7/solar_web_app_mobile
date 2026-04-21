import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2.5 rounded-full mr-2 border ${
        active ? 'bg-primaryStrong border-primaryStrong' : 'bg-surfaceMuted border-border'
      }`}
    >
      <Text
        className={`text-xs font-bold uppercase ${
          active ? 'text-white' : 'text-text'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
