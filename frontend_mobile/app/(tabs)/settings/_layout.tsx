import { Stack } from 'expo-router';

export default function SettingsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="branding" />
      <Stack.Screen name="pricing" />
      <Stack.Screen name="preferences" />
    </Stack>
  );
}
