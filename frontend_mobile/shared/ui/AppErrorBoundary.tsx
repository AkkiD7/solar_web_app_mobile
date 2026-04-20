import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';
import { solarTheme } from '../theme';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('AppErrorBoundary caught an error:', error);
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <View
          className="flex-1 px-6 items-center justify-center"
          style={{ backgroundColor: solarTheme.colors.background }}
        >
          <View
            className="w-full max-w-sm rounded-3xl p-6"
            style={{
              backgroundColor: solarTheme.colors.surface,
              borderWidth: 1,
              borderColor: solarTheme.colors.border,
            }}
          >
            <Text
              style={{
                color: solarTheme.colors.text,
                fontSize: 24,
                fontWeight: '800',
                marginBottom: 8,
              }}
            >
              Something went wrong
            </Text>
            <Text
              style={{
                color: solarTheme.colors.textMuted,
                fontSize: 14,
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              The app hit an unexpected error. You can try rendering the screen again.
            </Text>
            <Button title="Try Again" onPress={this.handleReset} />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
