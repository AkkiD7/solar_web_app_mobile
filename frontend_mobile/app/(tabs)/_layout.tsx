import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '../../shared/ui/icons';
import { solarShadows, solarTheme } from '../../shared/theme';

function TabIcon({
  label,
  icon,
  focused,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  focused: boolean;
}) {
  return (
    <View
      className="items-center justify-center"
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: focused ? solarTheme.colors.primarySoft : 'transparent',
      }}
    >
      <View
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{
          backgroundColor: focused ? '#f8dfcf' : 'transparent',
        }}
      >
        <Feather
          name={icon}
          size={17}
          color={focused ? solarTheme.colors.primaryStrong : solarTheme.colors.textSoft}
        />
      </View>
      <Text
        style={{
          color: focused ? solarTheme.colors.primaryStrong : solarTheme.colors.textSoft,
          fontSize: 10,
          fontWeight: '700',
          marginTop: 4,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 10),
          height: 74,
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 10,
          backgroundColor: solarTheme.colors.surface,
          borderTopWidth: 0,
          borderRadius: 28,
          ...solarShadows.floating,
        },
        tabBarItemStyle: {
          borderRadius: 18,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Home" icon="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Leads" icon="users" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Quotes" icon="file-text" focused={focused} />,
        }}
      />
      <Tabs.Screen name="lead" options={{ href: null }} />
      <Tabs.Screen name="quote" options={{ href: null }} />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Settings" icon="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
