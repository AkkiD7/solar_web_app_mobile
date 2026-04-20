import React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Feather } from './icons';
import { solarShadows, solarTheme } from '../theme';

interface SearchFieldProps extends TextInputProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function SearchField({ value, onChangeText, ...props }: SearchFieldProps) {
  return (
    <View
      className="flex-row items-center"
      style={[
        {
          backgroundColor: solarTheme.colors.input,
          borderRadius: solarTheme.radius.md,
          borderWidth: 1,
          borderColor: solarTheme.colors.border,
          paddingHorizontal: 14,
          minHeight: 48,
        },
        solarShadows.soft,
      ]}
    >
      <Feather name="search" size={18} color={solarTheme.colors.textSoft} />
      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={solarTheme.colors.textSoft}
        className="flex-1 ml-3 text-[15px]"
        style={{
          color: solarTheme.colors.text,
          paddingVertical: 12,
        }}
      />
    </View>
  );
}
