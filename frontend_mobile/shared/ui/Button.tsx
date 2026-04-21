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
  className?: string;
}

const variantStyles = {
  primary: {
    bg: 'bg-primaryStrong',
    border: 'border-primaryStrong',
    text: solarTheme.colors.white,
  },
  secondary: {
    bg: 'bg-surface',
    border: 'border-borderStrong',
    text: solarTheme.colors.primaryStrong,
  },
  outline: {
    bg: 'bg-transparent',
    border: 'border-borderStrong',
    text: solarTheme.colors.primaryStrong,
  },
  danger: {
    bg: 'bg-danger',
    border: 'border-danger',
    text: solarTheme.colors.white,
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
  className = '',
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || loading}
      activeOpacity={0.88}
      className={`flex-row items-center justify-center px-6 py-3.5 rounded-[18px] border min-h-[52px] ${styles.bg} ${styles.border} ${
        disabled || loading ? 'opacity-60' : ''
      } ${className}`}
      style={[
        variant === 'primary' ? solarShadows.soft : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={styles.text}
          style={{ marginRight: 10 }}
        />
      ) : null}
      {!loading && icon && iconPosition === 'left' ? <View className="mr-2.5">{icon}</View> : null}
      <Text
        style={{ color: styles.text }}
        className="text-base font-bold"
      >
        {title}
      </Text>
      {!loading && icon && iconPosition === 'right' ? <View className="ml-2.5">{icon}</View> : null}
    </TouchableOpacity>
  );
}
