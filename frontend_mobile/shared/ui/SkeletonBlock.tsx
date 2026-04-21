import React from 'react';
import { View, type ViewProps } from 'react-native';

export function SkeletonBlock({ className = '', style, ...props }: ViewProps) {
  return (
    <View 
      className={`bg-surfaceMuted rounded-full ${className}`} 
      style={style} 
      {...props} 
    />
  );
}
