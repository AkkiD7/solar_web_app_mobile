import React from 'react';
import {
  TextInput,
  Text,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { solarShadows, solarTheme } from '../theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  containerStyle?: ViewStyle | ViewStyle[];
}

export function InputField({
  label,
  error,
  multiline,
  editable = true,
  leftIcon,
  rightAccessory,
  containerStyle,
  ...props
}: InputFieldProps) {
  return (
    <View className="mb-4" style={containerStyle}>
      <Text
        style={{
          color: solarTheme.colors.textMuted,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 1.1,
          marginBottom: 8,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View
        className="flex-row items-start"
        style={[
          {
            backgroundColor: editable ? solarTheme.colors.input : solarTheme.colors.surfaceMuted,
            borderRadius: solarTheme.radius.md,
            borderWidth: 1,
            borderColor: error ? '#f0b5ac' : solarTheme.colors.border,
            paddingHorizontal: 14,
            minHeight: multiline ? 116 : 52,
            opacity: editable ? 1 : 0.78,
          },
          solarShadows.soft,
        ]}
      >
        {leftIcon ? <View style={{ marginTop: multiline ? 16 : 15, marginRight: 10 }}>{leftIcon}</View> : null}
        <TextInput
          {...props}
          editable={editable}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          className="flex-1 text-[15px]"
          style={{
            color: solarTheme.colors.text,
            paddingVertical: multiline ? 14 : 12,
            minHeight: multiline ? 88 : undefined,
          }}
          placeholderTextColor={solarTheme.colors.textSoft}
        />
        {rightAccessory ? <View style={{ marginTop: multiline ? 16 : 12, marginLeft: 10 }}>{rightAccessory}</View> : null}
      </View>
      {error ? (
        <Text
          style={{
            color: solarTheme.colors.danger,
            fontSize: 12,
            marginTop: 6,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
