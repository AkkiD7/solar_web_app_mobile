import '../global.css';
import { useEffect } from 'react';
import { Stack, router, useRootNavigationState, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { queryClient } from '../shared/api/queryClient';
import { useAuthStore } from '../features/auth/authStore';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { AppErrorBoundary } from '../shared/ui/AppErrorBoundary';
import { solarTheme } from '../shared/theme';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const token = useAuthStore((state) => state.token);
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    void loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!navigationState?.key || isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const shouldRedirectToLogin = !token && !inAuthGroup;
    const shouldRedirectToApp = !!token && inAuthGroup;

    if (!shouldRedirectToLogin && !shouldRedirectToApp) {
      return;
    }

    const timeout = setTimeout(() => {
      router.replace(token ? '/(tabs)/dashboard' : '/(auth)/login');
    }, 0);

    return () => clearTimeout(timeout);
  }, [isLoading, navigationState?.key, segments, token]);

  if (isLoading || !navigationState?.key) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: solarTheme.colors.background }}
      >
        <LoadingSpinner />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <AppErrorBoundary>
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </AuthGuard>
        </AppErrorBoundary>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
