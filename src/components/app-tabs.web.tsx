import {
    TabList,
    TabListProps,
    Tabs,
    TabSlot,
    TabTrigger,
    TabTriggerSlotProps,
} from 'expo-router/ui';
import { Image, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { Colors, MaxContentWidth } from '@/constants/theme';
import type { Href } from 'expo-router';

export default function AppTabs() {
  return (
    <Tabs style={styles.tabs}>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="dashboard" href={'/dashboard' as Href} asChild>
            <TabButton>Dashboard</TabButton>
          </TabTrigger>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>History</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const iconColor = isFocused ? colors.accent : colors.textSecondary;

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      {children === 'Dashboard' ? (
        <View style={styles.dashboardIcon}>
          <View style={[styles.dashboardSquare, { backgroundColor: iconColor }]} />
          <View style={[styles.dashboardSquare, { backgroundColor: iconColor }]} />
          <View style={[styles.dashboardSquare, { backgroundColor: iconColor }]} />
          <View style={[styles.dashboardSquare, { backgroundColor: iconColor }]} />
        </View>
      ) : (
        <Image
          source={children === 'Home'
            ? require('@/assets/icon/tabs/home.png')
            : require('@/assets/icon/tabs/explore.png')}
          tintColor={iconColor}
          style={styles.tabIcon}
          resizeMode="contain"
        />
      )}
      <Text style={[styles.tabLabel, { color: iconColor }]}>{children}</Text>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View
      {...props}
      style={[
        styles.tabListContainer,
        { backgroundColor: colors.background, borderTopColor: colors.backgroundSelected },
      ]}>
      <View style={styles.innerContainer}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
  },
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  dashboardIcon: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 2,
  },
  dashboardSquare: {
    width: 7,
    height: 7,
    borderRadius: 1,
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
