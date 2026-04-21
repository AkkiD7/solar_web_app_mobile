import { Redirect } from 'expo-router';

export default function Index() {
  // The AuthGuard in _layout.tsx will handle the actual redirection
  // based on the user's authentication state. We just need this file
  // so Expo Router doesn't throw a 404 on the root URL (/).
  return <Redirect href="/(auth)/login" />;
}
