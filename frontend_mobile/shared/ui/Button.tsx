import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
  View,
} from 'react-native';
import { solarShadows, solarTheme } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles = {
  primary: {
    backgroundColor: solarTheme.colors.primaryStrong,
    borderColor: solarTheme.colors.primaryStrong,
    textColor: solarTheme.colors.white,
  },
  secondary: {
    backgroundColor: solarTheme.colors.surface,
    borderColor: solarTheme.colors.borderStrong,
    textColor: solarTheme.colors.primaryStrong,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: solarTheme.colors.borderStrong,
    textColor: solarTheme.colors.primaryStrong,
  },
  danger: {
    backgroundColor: solarTheme.colors.danger,
    borderColor: solarTheme.colors.danger,
    textColor: solarTheme.colors.white,
  },
};

export function Button({
  title,
  loading,
  variant = 'primary',
  disabled,
  style,
  icon,
  iconPosition = 'left',
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || loading}
      activeOpacity={0.88}
      className="flex-row items-center justify-center px-6 py-3.5 rounded-[18px]"
      style={[
        {
          backgroundColor: styles.backgroundColor,
          borderWidth: 1,
          borderColor: styles.borderColor,
          minHeight: 52,
          opacity: disabled || loading ? 0.6 : 1,
        },
        variant === 'primary' ? solarShadows.soft : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={styles.textColor}
          style={{ marginRight: 10 }}
        />
      ) : null}
      {!loading && icon && iconPosition === 'left' ? <View style={{ marginRight: 10 }}>{icon}</View> : null}
      <Text
        style={{
          color: styles.textColor,
          fontSize: 16,
          fontWeight: '700',
        }}
      >
        {title}
      </Text>
      {!loading && icon && iconPosition === 'right' ? <View style={{ marginLeft: 10 }}>{icon}</View> : null}
    </TouchableOpacity>
  );
}
