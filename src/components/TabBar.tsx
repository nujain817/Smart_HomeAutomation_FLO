import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/tabs';

import { useHome } from '@/state/HomeContext';
import { colors, shadow } from '@/theme';
import { Icon, IconName } from './Icon';
import { Txt } from './ui';

const TABS: Record<string, { label: string; icon: IconName }> = {
  home: { label: 'Home', icon: 'home' },
  scenes: { label: 'Scenes', icon: 'sparkle' },
  energy: { label: 'Energy', icon: 'bars' },
  alerts: { label: 'Alerts', icon: 'bell' },
  profile: { label: 'Profile', icon: 'user' },
};

/** Floating pill navigation from the design: the active tab expands into a dark labelled pill. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { notifs } = useHome();
  const urgent = notifs.filter((n) => n.urgent).length;
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, 16) + 8 }]}>
      <View accessibilityRole="tablist" style={[styles.bar, shadow.float]}>
        {state.routes.map((route, i) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const focused = state.index === i;
          const onPress = () => {
            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={tab.label + (route.name === 'alerts' && urgent ? `, ${urgent} need attention` : '')}
              onPress={onPress}
              style={[styles.item, focused && styles.itemActive]}
            >
              <Icon name={tab.icon} size={focused ? 20 : 22} color={focused ? '#FFFFFF' : colors.navIcon} strokeWidth={1.9} />
              {focused ? (
                <Txt size={14} weight="semibold" color="#FFFFFF">
                  {tab.label}
                </Txt>
              ) : null}
              {route.name === 'alerts' && urgent > 0 && !focused ? <View style={styles.dot} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20 },
  bar: {
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  item: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  itemActive: { width: 'auto', paddingHorizontal: 18, backgroundColor: colors.ink },
  dot: {
    position: 'absolute',
    top: 12,
    right: 13,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
